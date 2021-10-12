import React, { Component } from "react";
import MahaloContract from "./contracts/Mahalo.json";
import ERC20Contract from "./contracts/ERC20.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: null,
      isOwner: false,
      isWhitelisted: false,
      isMember: false,
      tokenID: null,
      membersNumber: null,
      reserveBalance: null,
      reserveCurrency: null,
      contribution: null,
      input: "",
      web3: null,
      contract: null,
      contractAddress: null,
      reserveInstance: null,
      account: null,
      contractName: 'Mahalo Demo',
      network: 4,
      balance: null,
      gasUsed: null,
      members: [],
    };
  }

  instantiateContract() {
    const contract = require("@truffle/contract");
    const Mahalo = contract(MahaloContract);
    Mahalo.setProvider(this.state.web3.currentProvider);
    Mahalo.deployed().then((instance) => {
      return instance;
    });
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balance = web3.utils.fromWei(balanceWei, "ether");

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MahaloContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MahaloContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed interacting with the contract's methods.
      this.setState(
        {
          web3,
          account: accounts[0],
          contract: instance,
          network: networkId,
          balance: balance,
        },
        this.runConnect
      );
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runConnect = async () => {
    this.instantiateContract();
    const { web3, account, contract } = this.state;
    const contractOwner = await contract.methods.owner().call();
    const contract_address = contract._address;
    const contribution = await contract.methods.contribution().call();
    const count = await contract.methods.getMembersLength().call();
    const reserveCurrency = await contract.methods.reserveCurrency().call();
    const reserveInstance = new web3.eth.Contract(ERC20Contract.abi, reserveCurrency);
    const reserveBalance = await contract.methods.reserveBalance().call();
    const whitelisted = await contract.methods.whiteList(account).call();
    const members = await contract.methods.getMembers().call();
    
    this.setState({ isWhitelisted: whitelisted, members: members, owner: contractOwner, contractAddress: contract_address, reserveBalance: reserveBalance, reserveCurrency: reserveCurrency, reserveInstance: reserveInstance, contribution: contribution, membersNumber: count});

    if (contractOwner === account) {
      this.setState({ isOwner: true });
    }

    const memberBalance = await contract.methods.balanceOf(account).call();
    const id = await contract.methods.tokenId(account).call();
    if (parseInt(memberBalance) > 0) {
      this.setState({ isMember: true, tokenID: id });
    }
  };

  handleApprove(event) {
    this.instantiateContract();
    const { account, isWhitelisted, contractAddress, reserveInstance, contribution } = this.state;
    if(isWhitelisted) {
    //user approving in JS
      reserveInstance.methods
        .approve(contractAddress, contribution) 
        .send({ from: account })
        .then((result) => {
          console.log("tokens approved");
          return this.runConnect();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleContribute(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .contribute()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleAddressInput = (event) => {
    var array = event.target.value.split(',');
    this.setState({ input: array });
  }

  handleWhitelist(event) {
    this.instantiateContract();
    const { account, contract, input } = this.state;
    contract.methods
      .whitelist(input)
      .send({ from: account })
      .then((result) => {
        const gasUsed = result.gasUsed;
        console.log("handlewhitelist gasUsed", gasUsed);
        this.setState({ gasUsed: gasUsed });
        return this.runConnect();
      });
  }

  handleRemove(event) {
    this.instantiateContract();
    const { account, contract, input } = this.state;
    contract.methods
      .remove(input)
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handlePause(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .pause()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleUnpause(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .unpause()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleKill(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .kill()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  handleWithdraw(event) {
    this.instantiateContract();
    const { account, contract } = this.state;
    contract.methods
      .withdraw()
      .send({ from: account })
      .then((result) => {
        return this.runConnect();
      });
  }

  render() {
    if (!this.state.web3)
      return (
        <div className="noWeb3">
          Loading Web3, accounts, and contract...
          <p>You may need to install Metamask:</p>
          <a href="https://metamask.io/download.html">
            Metamask Browser Extension
          </a>
        </div>
      );
    else if (this.state.isOwner)
      return (
        <div className="isOwner">
          <div className="row">
            <h2>Your account owns this contract!</h2>
            <h3>Contract Name: {this.state.contractName}</h3>
            <p>Contract Address: {this.state.contractAddress}</p>
            <p>The Reserve Currency is: {this.state.reserveCurrency}</p>
            <p>There are a total of {this.state.membersNumber} members</p>
            <p>Your Wallet: {this.state.account}</p>
            <p>Your ETH Balance: {this.state.balance} ETH</p>
            <p>Reserve Currency balance (available to withdraw): {this.state.reserveBalance} </p>
            <button onClick={this.handleWithdraw.bind(this)}>
                  Withdraw Reserves
            </button>
            <br></br>
            <h3>Member Management</h3>
            <p>Enter an Ethereum Address:</p>
            <input
              type="text"
              size="50"
              id="address"
              onChange={this.handleAddressInput}
            />
            <br></br>
            <button onClick={this.handleWhitelist.bind(this)}>
              Whitelist
            </button>
            <br></br>
            <div className="management">
              <h3>Contract Management</h3>
              <button onClick={this.handlePause.bind(this)}>
                Pause Contract
              </button>
              <button onClick={this.handleUnpause.bind(this)}>
                Unpause Contract
              </button>
              <br></br>
              <br></br>
              <button onClick={this.handleKill.bind(this)}>
                Kill Contract
              </button>
            </div>
            <div className="members">
              <h3>Members List</h3>
              <p>{this.state.members}</p>
            </div>
          </div>
        </div>
      );
    else if (this.state.isMember)
      return (
        <div className="App">
          <div className="row">
            <h2>Thank you for your contribution to {this.state.contractName}</h2>
            <p>Contract Address: {this.state.contractAddress}</p>
            <p>Contract Owner: {this.state.owner}</p>
            <p>The Reserve Currency is: {this.state.reserveCurrency}</p>
            <p>Your Wallet: {this.state.account}</p>
            <p>Your {this.state.contractName} NFT tokenId is {this.state.tokenID} </p>
            <p>There are a total of {this.state.membersNumber} members</p>
            <p>
              Network ID:{" "}
              {this.state.network ? `${this.state.network}` : "No connection"}
            </p>
          </div>
          <div className="row">
            <div className="pure-g">

              <br></br>
              <img src='http://www.afrostateofmind.com/wp-content/uploads/2015/08/Members-only.png'
              height='300' width='450'/>
            </div>
          </div>
        </div>
      );
    else if (!this.state.isMember)
      return (
        <div className="notMember">
          <h2>Welcome to: {this.state.contractName}!</h2>
          <p>Contract Address: {this.state.contractAddress}</p>
          <p>The Reserve Currency is: {this.state.reserveCurrency}</p>
          <p>There are currently {this.state.membersNumber} out of 80 maximum member contributions</p>
          You are not a Member yet
          <br></br>
          <button onClick={this.handleApprove.bind(this)}>
            1. Approve USDC 
          </button> Verify the approval amount matches the desired contribution
          <br></br>
          <button onClick={this.handleContribute.bind(this)}>
            2. Send Contribution
          </button> Verify the recipient address matches the Contract Address above
        </div>
      );
  }
}

export default App;
