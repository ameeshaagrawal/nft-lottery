const { ethers, waffle, network } = require("hardhat");
const { sha256 } = require("ethers/lib/utils");
const { BigNumber } = require("ethers");
const { use, expect } = require("chai");

const { solidity } = waffle;
use(solidity);

describe("NFT Lottery", () => {
  let admin, lotteryOwner, user1, user2, user3, user4;
  let Ticket;

  beforeEach(async () => {
    [admin, lotteryOwner, user1, user2, user3, user4] =
      await ethers.getSigners();

    const Beacon = await ethers.getContractFactory("Beacon");
    const TicketFactory = await ethers.getContractFactory("TicketFactory");
    Ticket = await ethers.getContractFactory("Ticket");

    this.ticket = await Ticket.deploy();
    this.beacon = await Beacon.deploy(admin.address, this.ticket.address);
    this.ticketFactory = await TicketFactory.deploy(this.beacon.address);
  });

  it("Full scenario test run", async () => {
    // deploy ticket as a beacon proxy
    const currentBlock = await ethers.provider.getBlockNumber();

    const startBlock = currentBlock + 10;
    const endBlock = currentBlock + 50;
    const ticketPrice = BigNumber.from(1).mul(BigNumber.from(10).pow(17)); // 0.1 ETH
    const name = "First Lottery";
    const symbol = "LOTTERY-1";
    const uri = "";
    const salt = sha256(Buffer.from("first lottery"));
    const options = { value: ticketPrice };

    const ticketAddress = await this.ticketFactory.preComputeAddress(
      lotteryOwner.address,
      salt
    );

    await this.ticketFactory
      .connect(lotteryOwner)
      .createTicket(startBlock, endBlock, ticketPrice, name, symbol, uri, salt);

    this.lotteryTicket = await Ticket.attach(ticketAddress);

    // users purchasing ticket
    await blocksTravel(10);

    await this.lotteryTicket.connect(user1).buyTicket(options);
    await this.lotteryTicket.connect(user2).buyTicket(options);
    await this.lotteryTicket.connect(user3).buyTicket(options);
    await this.lotteryTicket.connect(user4).buyTicket(options);

    // lottery owner selecting surprise winner
    let initialContractBalance = await ethers.provider.getBalance(
      this.lotteryTicket.address
    );
    expect(initialContractBalance).to.be.eq(ticketPrice.mul(BigNumber.from(4)));

    await this.lotteryTicket.connect(lotteryOwner).declareSurpriseWinner();

    let finalContractBalance = await ethers.provider.getBalance(
      this.lotteryTicket.address
    );

    const winningAmount = initialContractBalance.div(2);
    expect(finalContractBalance).to.be.eq(winningAmount);

    const surpriseWinner = await this.lotteryTicket.getSurpriseWinner();
    expect(surpriseWinner).to.not.be.eq(ethers.constants.AddressZero);

    // lottery admin selecting lottery winner
    await blocksTravel(50);

    initialContractBalance = finalContractBalance;

    await this.lotteryTicket.connect(lotteryOwner).declareLotteryWinner();

    finalContractBalance = await ethers.provider.getBalance(
      this.lotteryTicket.address
    );

    expect(finalContractBalance).to.be.eq(0);

    const lotteryWinner = await this.lotteryTicket.getLotteryWinner();
    expect(lotteryWinner).to.not.be.eq(ethers.constants.AddressZero);
  });
});

const blocksTravel = async (blocks) => {
  for (let index = 0; index < blocks; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
};
