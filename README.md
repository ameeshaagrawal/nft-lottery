# NFT Lottery

## Problem Statement

Users should be able to buy a ticket which is an actual NFT. The funds
from each ticket purchase are gathered in a prize pool. After a
certain period of time a random winner should be chosen. We also want
to be able to update our NFT tickets in the future.

## Solution

The smart contracts are using Beacon proxy which allows updating the implementation of all the proxies by a single transaction.

The Beacon contract registers the latest implementation of Ticket contract. This is used by TicketProxy contract which goes to beacon for latest implementation and uses it for the transaction further.

The setup involves a TicketFactory contract which can be used for deploying multiple Ticket contracts.

User flow:

- When the ticket is deployed, it is initialised with startBlock and endBlock which indicates the block limits where users can come and buy the tickets.
- In this period, the Ticket owner can declare a surprise winner which will be randomly chosen by the function and in the same transaction, the 50% funds will be transferred.
- When the purchase period ends, owner will declare the next winner which will be rewarded the remaining funds.

Assumptions:

- There are 2 type of winners, surprise winner (in purchase period) and lottery winner (after the purchase period ends)
- One lotteryId can be eligible for both the prices.
- The random function is not considering the manipulations from miner's and owner's ends hence cannot be used in production.

Contracts deployed on Ropsten Testnet:

- Beacon: [0xcdca8b01A3Aa9fb635A78e57816bB5DC5E446C3a](https://ropsten.etherscan.io/address/0xcdca8b01A3Aa9fb635A78e57816bB5DC5E446C3a#code)
- Ticket Implementation: [0x81e67E8290e37976D3a0cCe0Ce535f9eA76fABfb](https://ropsten.etherscan.io/address/0x81e67E8290e37976D3a0cCe0Ce535f9eA76fABfb#code)
- TicketFactory: [0x79Bd86F33bcBB3EAF87E5c5b77EAa02E554621C3](https://ropsten.etherscan.io/address/0x79Bd86F33bcBB3EAF87E5c5b77EAa02E554621C3#code)
- TicketProxy: [0x85d89e4a10632d6ee0e0e43c1e1b9da6fe59f59e](https://ropsten.etherscan.io/address/0x85d89e4a10632d6ee0e0e43c1e1b9da6fe59f59e#code)

Transactions:

1. [createTicket()](https://ropsten.etherscan.io/tx/0x3d2f7756d8c8a52c0bfe2f41e229bbd0ed40e84e972055a514a9d9bada95f07b)
2. [buyTicket()](https://ropsten.etherscan.io/tx/0xe0dca1ea9b178146e9b3f018c213a367b733d065f2245f30f5b936a66d64401a)
3. [declareSurpriseWinner()](https://ropsten.etherscan.io/tx/0xc2fd410a385ed9e2ea1587d6eff79a694b09b70d6c4febd6c8346ed5ae63de29)
4. [declareLotteryWinner()](https://ropsten.etherscan.io/tx/0x36e299c54d4512c4dc9c5866501f7a6ff5468ae7c64a7fa16bfe5e03df9f127e)

## Setup

1. Clone the repository using this command `git clone git@github.com:ameesha1205/nft-lottery.git`
2. Install dependencies: `yarn`

### Deploy

Now you can try deploying the contracts on ropsten or hardhat local network:

For hardhat:

`npx hardhat run scripts/lottery.js`

For Ropsten:
First create an env file and add the needed keys and details. (Please find .env.example in the repo)

`npx hardhat run scripts/lottery.js --network ropsten`

### Test

To run the smart contract tests:

`yarn test`

### Coverage

To run the smart contract test coverage:

`yarn test:coverage`
