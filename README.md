# Mahalo NFT

A simple Ethereum-based decentralized application (dapp) to create and obtain non-fungible membership tokens. Based on the [ERC-721](https://erc721.org) standard, these tokens are clear of user approvals making them nontransferable while also avoiding re-sale in secondary markets. Holding them in an ethereum wallet will grant access to the content enabled for token holders by the contract owner in their front-end and future Internet of Things integrations.

---

## Prerequisites

* **Node** - v12.x.x (preferrably v12.18.3 for long term support)
* **npm** - v6.x.x (preferrably v6.14.8)

## Running Locally

Clone this repo to your local machine and install the dependencies as follows:

```bash
git clone https://github.com/tian0/mahalo.git
cd mahalo
npm install
```

A contract deployment instance is available on Ethereum's Rinkeby testnet, at the following address: 
`0xAb9741159053cA6da097DCC19777f7213A1a5957`

To deploy your own Mahalo contract instance on Rinkeby, first paste your own INFURA_PROJECT_ID and contract owner wallet MNEMONIC in the .env file, and in the terminal run:
```bash
truffle compile
truffle migrate --network rinkeby
```

To deploy locally, first install and run an Ethereum development testnet using [Ganache](https://www.trufflesuite.com/ganache):

```bash
npm install -g ganache-cli
ganache-cli
```

After ganache launches, run the following to compile and deploy the Membership contract:

```bash
truffle compile
truffle migrate
```

Finally, install the client dependencies and serve the application in the development environment via:

```bash
cd client
npm install
npm run start
```

With Metamask installed and connected to Rinkeby, you should be able to join an existing Mahalo contract once your addres is Whitelisted on Rinkeby at contract address `0xAb9741159053cA6da097DCC19777f7213A1a5957`

There are 3 dashboards: non-member, member, and owner

The non-member dashboard will display:
1. Contract Name
2. Contract Address
3. Reserve Currency
4. Total number of Members
5. "You are not a Member yet"
6. Approve USDC button
7. Send Contribution button

The member dashboard will allow you to see:
1. Contract Address & Citadel Name
2. Contract Owner's Address
3. Reserve Currency
4. Your ETH Wallet
5. Your NFT tokenId
6. The total number of Members
7. The Network ID (4 is Rinkeby)


If you deploy your own Membership contract instance, the Owner dashboard will allow you to see:
1. Contract Name and Address
2. Reserve Currency
3. The total number of Members
4. Your ETH Wallet
5. Your ETH Balance
6. Reserve Currency Balance (available to withdraw)
7. Withdraw Reserves button
8. Member Management Panel
9. Address Input Field (for whitelisting)
10. Whitelist button
11. Contract Management Panel
12. Pause, Unpause, and Kill buttons
13. Members List 

Only whitelisted addresses will be allowed to contribute and have the NFT minted to their address. Owners can withdraw the reserve currency balance by clicking the [Withdraw-Reserves] button. Owners can whitelist addresses by pasting one or several comma-separated addresses in the Member Management section and clicking the [Whitelist] button. The Contract Management Panel allows the owner to [Pause], [Unpause], and [Kill] the contract.

## Built With

* [Truffle](https://www.trufflesuite.com/boxes/react) - Truffle React Box
* [Solidity](https://solidity.readthedocs.io/en/v0.5.3/) - Ethereum's smart contract programming language
* [React.js](https://reactjs.org/) - Javascript framework used
* [web3.js](https://github.com/ethereum/web3.js/) - Javascript library used to interact with the Ethereum blockchain