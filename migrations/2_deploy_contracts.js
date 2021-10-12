var Mahalo = artifacts.require("./Mahalo.sol");
const web3 = require('../node_modules/web3');

module.exports = function(deployer) {
  const reserveCurrency = '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b'; //Rinkeby USDC contract
  const contribution = 1000000; //Rinkeby USDC has 6 decimals, this is 10 USDC for testing purposes
  deployer.deploy(Mahalo, reserveCurrency, contribution);
};
