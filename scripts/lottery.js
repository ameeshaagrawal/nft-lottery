const { getNamedAccounts, getChainId } = require("hardhat");
const { deployAndVerify } = require("./utils");

const contracts = [];

const main = async () => {
  const namedAccounts = await getNamedAccounts();
  const chainId = await getChainId();

  const { deployer } = namedAccounts;

  const ticket = await deployAndVerify(
    "Ticket",
    [],
    deployer,
    "contracts/Ticket.sol:Ticket",
    chainId
  );

  const beacon = await deployAndVerify(
    "Beacon",
    [deployer, ticket.address],
    deployer,
    "contracts/proxy/Beacon.sol:Beacon",
    chainId
  );

  const ticketFactory = await deployAndVerify(
    "TicketFactory",
    [beacon.address],
    deployer,
    "contracts/TicketFactory.sol:TicketFactory",
    chainId
  );

  contracts.push({ ticket: ticket.address });
  contracts.push({ beacon: beacon.address });
  contracts.push({ ticketFactory: ticketFactory.address });

  console.log(contracts);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
