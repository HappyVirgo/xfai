/* eslint-disable quote-props */
/* eslint-disable max-len */
// const PairAbi = require('./abis/pair.json');
const xfaiAbi = require('./abis/xfai.json');
const erc20Abi = require('./abis/erc20.json');
const pairAbi = require('./abis/pair.json');
const config = require('../config');
const networkId = config.networkId;
const { xfaiAddress } = require('./constants');

export function getXfaiContract() {
  return new window.web3.eth.Contract(
    xfaiAbi,
    xfaiAddress[networkId],
  );
}

export function getERC20Contract(address) {
  return new window.web3.eth.Contract(
    erc20Abi,
    address,
  );
}

export function getLPContract(address) {
  return new window.web3.eth.Contract(
    pairAbi,
    address,
  );
}
