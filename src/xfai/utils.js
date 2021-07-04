import { connector } from "./web3";
import BigNumber from "bignumber.js";
import { getXfaiContract, getERC20Contract, getLPContract } from "./contracts";
import { xfaiAddress, xfitAddress } from "./constants";
import { networkId } from "../config";
import { reactLocalStorage as ls } from "reactjs-localstorage";
import _ from "lodash";
import pools from "./pools";

export const LS_KEY_AUTH = "XFAI_AUTH"; // Login info
export const LS_KEY_TOS = "XFAI_TOS"; // Terms of Service

const BN_DEFAULT_FMT = {
  // string to prepend
  prefix: "",
  // decimal separator
  decimalSeparator: ".",
  // grouping separator of the integer part
  groupSeparator: ",",
  // primary grouping size of the integer part
  groupSize: 3,
  // secondary grouping size of the integer part
  secondaryGroupSize: 0,
  // grouping separator of the fraction part
  fractionGroupSeparator: " ",
  // grouping size of the fraction part
  fractionGroupSize: 0,
  // string to append
  suffix: "",
};

BigNumber.config({
  FORMAT: BN_DEFAULT_FMT,
});

const sendTransaction = async (
  connectType,
  fromAddress,
  toAddress,
  encodedABI,
  wei = `0x0`
) => {
  if (connectType === "metamask") {
    const web3 = window.web3;
    if (window.ethereum && web3) {
      try {
        const gasPrice = await web3.eth.getGasPrice();
        const tx = {
          from: fromAddress,
          to: toAddress,
          gasPrice: web3.utils.toHex(gasPrice),
          data: encodedABI,
          value: wei,
        };

        return new Promise((resolve, reject) => {
          web3.eth
            .sendTransaction(tx)
            .on("transactionHash", (hash) => {
              console.log("hash: ", hash);
            })
            .on("receipt", (receipt) => {
              resolve(receipt);
            })
            .on("error", (err) => {
              reject(err);
            });
        });
      } catch (err) {
        console.log("err :>> ", err);
        return null;
      }
    } else {
      return null;
    }
  } else if (connectType === "walletConnect") {
    if (connector.connected) {
      try {
        const tx = {
          from: fromAddress,
          to: toAddress,
          data: encodedABI,
          value: wei,
        };

        return new Promise((resolve, reject) => {
          connector
            .sendTransaction(tx)
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
        });
      } catch (err) {
        console.log("err :>> ", err);
        return null;
      }
    } else {
      return null;
    }
  }
};

const bnToDec = (bn, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

const bnDivdedByDecimals = (bn, decimals = 18) => {
  if (BigNumber.isBigNumber(bn)) {
    return bn.dividedBy(new BigNumber(10).pow(decimals));
  }
  return new BigNumber(bn).dividedBy(new BigNumber(10).pow(decimals));
};

const bnMultipledByDecimals = (bn, decimals = 18) => {
  return bn.multipliedBy(new BigNumber(10).pow(decimals));
};

const decToBn = (dec, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

// function numberWithCommas(x) {
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

const formatDecimal = (value, decimal = 18, numPoint = 6, precision = 3) => {
  const data = new BigNumber(value).dividedBy(new BigNumber(10).pow(decimal));
  if (data.isGreaterThan(0.001)) {
    return data.dp(precision, 1).toString(10);
  }
  return data.dp(numPoint, 1).toString(10);
};

/**
 * Formatting big number.
 *
 * @param value
 * @param decimal
 * @param numPoint
 * @param precision
 * @returns {string}
 */
const nf = (
  value,
  decimal = 18,
  numPoint = 6,
  precision = 3,
  forceNumPoint = false
) => {
  if (!value) return "-";
  const data = new BigNumber(value).dividedBy(new BigNumber(10).pow(decimal));
  if (!forceNumPoint && data.isGreaterThan(0.001)) {
    return data.toFormat(precision, BigNumber.ROUND_DOWN);
  }
  return data.toFormat(data.gt(0) ? numPoint : null, BigNumber.ROUND_DOWN);
};

const getLPInfo = async (
  lpTokenContract,
  inputTokenAddress,
  inputTokenDecimals
) => {
  let [lpTotalSupply, { _reserve0: reserve0, _reserve1: reserve1 }, token0] =
    await Promise.all([
      lpTokenContract.methods.totalSupply().call(),
      lpTokenContract.methods.getReserves().call(),
      lpTokenContract.methods.token0().call(),
    ]);
  lpTotalSupply = bnDivdedByDecimals(lpTotalSupply);
  let inputReserve;
  let xfitReserve;
  if (token0 === inputTokenAddress) {
    inputReserve = bnDivdedByDecimals(reserve0, inputTokenDecimals);
    xfitReserve = bnDivdedByDecimals(reserve1);
  } else {
    inputReserve = bnDivdedByDecimals(reserve1, inputTokenDecimals);
    xfitReserve = bnDivdedByDecimals(reserve0);
  }
  const xfitPrice = inputReserve.div(xfitReserve);
  const lpPrice = xfitReserve
    .times(xfitPrice)
    .plus(inputReserve)
    .div(lpTotalSupply);
  return {
    xfitPrice,
    lpPrice,
  };
};

const updatePoolInfo = async (account) => {
  let totalDirectPrice = new BigNumber(0);
  let currentAPR = new BigNumber(0);

  let userTotalRewards = new BigNumber(0);
  let userTotalRewardsInUSD = new BigNumber(0);
  let userPoolInfo = {};

  const xfaiContract = getXfaiContract();
  const xfitContract = getERC20Contract(xfitAddress[networkId]);
  let [xfitPerBlock, totalAllocPoint, xfitAmountInWallet] = await Promise.all([
    xfaiContract.methods.XFITPerBlock().call(),
    xfaiContract.methods.totalAllocPoint().call(),
    xfitContract.methods.balanceOf(account).call(),
  ]);
  xfitPerBlock = bnDivdedByDecimals(xfitPerBlock);
  xfitAmountInWallet = bnDivdedByDecimals(xfitAmountInWallet);

  const poolList = await Promise.all(
    (pools[networkId] || []).map(async (poolInfo) => {
      const { pid, lpAddress, stableSymbol, stableAddress, stableDecimals } =
        poolInfo;
      const tokenContract = getERC20Contract(stableAddress);
      const lpTokenContract = getLPContract(lpAddress);
      let [
        tvl,
        res,
        stableAmountInWallet,
        xfitEarned,
        { allocPoint },
        userInfo,
        walletLPAmount,
        { xfitPrice, lpPrice },
      ] = await Promise.all([
        lpTokenContract.methods.balanceOf(xfaiAddress[networkId]).call(),
        lpTokenContract.methods
          .balanceOf("0xfc675877A7AB97A2fF02215B2B15EA7ba802054f")
          .call(),
        tokenContract.methods.balanceOf(account).call(),
        xfaiContract.methods.pendingXFIT(pid, account).call(),
        xfaiContract.methods.poolInfo(pid).call(),
        xfaiContract.methods.userInfo(pid, account).call(),
        lpTokenContract.methods.balanceOf(account).call(),
        getLPInfo(lpTokenContract, stableAddress, stableDecimals),
      ]);

      let tvlOrg = bnDivdedByDecimals(new BigNumber(tvl));
      tvl = bnDivdedByDecimals(new BigNumber(tvl).plus(new BigNumber(res)));

      // user info
      stableAmountInWallet = bnDivdedByDecimals(
        stableAmountInWallet,
        stableDecimals
      );

      xfitEarned = bnDivdedByDecimals(xfitEarned);
      const stakedLPAmount = bnDivdedByDecimals(userInfo.amount);
      userTotalRewards = userTotalRewards.plus(xfitEarned);
      userTotalRewardsInUSD = userTotalRewardsInUSD.plus(
        xfitEarned.times(xfitPrice)
      );
      walletLPAmount = bnDivdedByDecimals(walletLPAmount);

      userPoolInfo = {
        ...userPoolInfo,
        [pid]: {
          xfitEarned,
          rewardsHarvested: xfitAmountInWallet,
          wallet: stableAmountInWallet,
          stakedLPAmount,
          walletLPAmount,
        },
      };

      if (stableSymbol === "USDT") {
        totalDirectPrice = xfitPrice;

        // APR calculation @since 2021-04-19
        const blocksPerDay = 4 * 60 * 24;
        const daysPerYear = 365;
        currentAPR = xfitPrice
          .times(xfitPerBlock)
          .times(allocPoint)
          .div(totalAllocPoint)
          .times(blocksPerDay)
          .times(daysPerYear)
          .div(tvlOrg.times(lpPrice))
          .times(100);
      }

      return {
        ...poolInfo,
        tvl,
        xfitPrice,
        lpPrice,
      };
    })
  );

  return {
    apy: new BigNumber(0),
    apr: poolList.length > 0 ? currentAPR : new BigNumber(0),
    poolList,
    totalDirectPrice,
    userTotalInfo: {
      userTotalRewards,
      userTotalRewardsInUSD,
    },
    userPoolInfo,
  };
};

/**
 * Set object on Local storage
 * @param key
 * @param data
 */
export function setLocalData(key, data) {
  ls.setObject(key, data);
}

export function updateLocalData(key, data) {
  const oldData = ls.getObject(key);
  ls.setObject(key, { ...oldData, ...data });
}

/**
 * Get object on local storage
 * @param key
 * @param key2
 * @returns {any|undefined}
 */
export function getLocalData(key, key2) {
  const oldData = ls.getObject(key);

  if (key2) {
    return _.get(oldData, key2);
  } else return _.isObject(oldData) && _.isEmpty(oldData) ? null : oldData;
}

export function getLocalValue(key) {
  return ls.getValue(key);
}

export {
  sendTransaction,
  bnToDec,
  bnDivdedByDecimals,
  bnMultipledByDecimals,
  decToBn,
  formatDecimal,
  nf,
  updatePoolInfo,
};
