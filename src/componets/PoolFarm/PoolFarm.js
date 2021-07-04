import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Divider,
  HStack,
  Link,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillPlusCircle } from "react-icons/ai";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { nf } from "../../xfai/utils";
import BigNumber from "bignumber.js";
import NumberFormat from "react-number-format";
import {
  getXfaiContract,
  getERC20Contract,
  getLPContract,
} from "../../xfai/contracts";
import { bnMultipledByDecimals, bnDivdedByDecimals } from "../../xfai/utils";
import { StyledButton } from "../Button";
import { useSelector } from "react-redux";
import { START_BLOCK_NO, xfaiAddress } from "../../xfai/constants";
import { networkId } from "../../config";
import { NotificationManager } from "react-notifications";
import Tooltip from "../Tooltip";
import { ConnectWalletModal } from "../ConnectWalletModal";
import useBlock from "../../hooks/useBlock";
import "./index.css";
import { AddToFarm } from "./Partials/AddToFarm";
import { Harvest } from "./Partials/Harvest";
import {
  StyledAmountWrap,
  StyledInput,
  StyledInputHelpDiv,
  StyledTitle,
} from "./Styles";
import { LoadingFarm } from "../LoadingFarm";
import useUpdater2 from "../../hooks/useUpdater2";
import styled from "styled-components";
import dropdown from "../../assets/images/dropdown.svg";
import checkmark from "../../assets/images/checkmark.svg";

const StyledSelect = styled.div`
  position: relative;

  .label {
    cursor: pointer;
    font-size: 13px;
    display: flex;
    img {
      margin-left: 7px;
      margin-bottom: 1px;
    }
  }

  .popupSelect {
    z-index: 1000;
    position: absolute;
    background-color: #1a1a1a;
    border: 2px solid #262626;
    border-radius: 10px;
    box-shadow: 0px 4px 6px #00000033;
    top: -10px;
    left: -10px;
    font-size: 13px;
    padding: 7px 8px;
    width: 300px;

    .item {
      display: flex;
      justify-content: flex-start;
      border-radius: 5px;
      padding: 5px 7px;
      text-align: left;
      cursor: pointer;

      &.selected {
        background-color: #262626;

        span {
          margin-left: 7px;
        }
      }

      span {
        margin-left: 16px;
      }
    }
  }
`;

const StyledMax = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  > :not(style) ~ :not(style) {
    margin-inline-start: 4px;
  }
`;

const MSG_AMOUNT_REQUIRED = "! Please enter an amount";
const MSG_NO_CURRENCY = "! The currency required for this pool is not in your wallet";
const MSG_AMOUNT_EXCEEDED = "! This amount exceeds your wallet";

function useOutsideAlerter(ref, setShowSelect) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSelect(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setShowSelect]);
}

const PoolDetails = ({userInfo, poolInfo}) => {
  const [disclose, setDisclose] = useState(false);
  const toggleDisclose = () => {
    setDisclose(!disclose);
  };

  const renderDetails = () => {
    return (
      <Collapse in={disclose} animateOpacity>
        <Box mt={4} className="pool-box-detail">
          <Flex bg="#262626" paddingY={2} paddingX={5} justify="space-between">
            <HStack>
              <Text fontSize={14}>Staked:</Text>
              <Tooltip
                label={`${nf(
                  userInfo.stakedLPAmount,
                  0,
                  18,
                  18
                )} LP Tokens - Displays the amount you have staked in this liquidity pool in the form of LP tokens. LP tokens are paired tokens, one is the currency of the pool and the other is XFIT.`}
              />
            </HStack>
            <Text fontSize={14} className="values">
              {/*{nf(userInfo.stakedLPAmount, 0)} LP tokens{" "}*/}
              {`${
                userInfo.stakedLPAmount.isZero()
                  ? 0
                  : userInfo.stakedLPAmount.lt(0.001)
                  ? "0.0..." +
                  userInfo.stakedLPAmount.toString(10).slice(-3)
                  : nf(userInfo.stakedLPAmount, 0)
              } LP Tokens`}
              <span style={{fontSize: 12}}  textAlign="right">
                {" "}
                ($
                {nf(userInfo.stakedLPAmount.times(poolInfo.lpPrice), 0)})
              </span>
            </Text>
          </Flex>

          <Flex paddingY={2} paddingX={5} justify="space-between">
            <HStack>
              <Text fontSize={14}>XFIT earned:</Text>
              <Tooltip label="This displays the total amount you have earned in this pool for the current session."/>
            </HStack>
            <Text fontSize={14}  textAlign="right"  className="values">
              {nf(userInfo.xfitEarned, 0, 3, 3, true)} XFIT{" "}
              <span style={{fontSize: 12}}>
                ($
                {nf(userInfo.xfitEarned.times(poolInfo.xfitPrice), 0)})
              </span>
            </Text>
          </Flex>

          <Flex bg="#262626" paddingY={2} paddingX={5} justify="space-between">
            <HStack className="box-detail-rewards">
              <Text fontSize={14}>Rewards harvested:</Text>
              <Tooltip label="The total number of XFIT tokens harvested from this pool for the current session."/>
            </HStack>
            <Text fontSize={14} textAlign="right" className="values">
              {nf(userInfo.rewardsHarvested, 0)} XFIT{" "}
              <span style={{fontSize: 12}}>
                ($
                {nf(userInfo.rewardsHarvested.times(poolInfo.xfitPrice), 0)})
              </span>
            </Text>
          </Flex>

          <Flex paddingY={2} paddingX={5} justify="space-between">
            <HStack>
              <Text fontSize={14}>Pool share:</Text>
              <Tooltip label="Represents the percentage of how much you have staked in the pool compared to others."/>
            </HStack>
            <Text fontSize={14}>
              {poolInfo.tvl.isZero()
                ? 0
                : nf(
                  userInfo.stakedLPAmount.div(poolInfo.tvl).times(100),
                  0
                )}{" "}
              %
            </Text>
          </Flex>
        </Box>
      </Collapse>
    );
  };

  return (
    <Box className="pool-detail">
      <Flex justify="center" mt={1} align="center" className="tns-blue">
        <Link
          _hover={{
            textDecoration: "none",
          }}
        >
          <Text fontSize={14} onClick={toggleDisclose}>
            DETAILS
          </Text>
        </Link>
        {!disclose ? (
          <FiChevronDown
            onClick={toggleDisclose}
            size={19}
            style={{marginLeft: 3}}
          />
        ) : null}
        {disclose ? (
          <FiChevronUp
            onClick={toggleDisclose}
            size={19}
            style={{marginLeft: 3}}
          />
        ) : null}
      </Flex>
      {renderDetails()}
    </Box>
  );
};

const InitUserInfo = {
  xfitEarned: new BigNumber(0),
  rewardsHarvested: new BigNumber(0),
  wallet: new BigNumber(0),
  walletLPAmount: new BigNumber(0),
  stakedLPAmount: new BigNumber(0),
};

export const PoolFarm = ({pid, pool, testValue}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [harvestLoading, setHarvestLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [isStableSelected, setIsStableSelected] = useState(true);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setShowSelect);

  const [amount, setAmount] = useState(new BigNumber(-1));
  const [rightAmount, setRightAmount] = useState(new BigNumber(0));
  const [amountError, setAmountError] = useState();
  const [amountHint, setAmountHint] = useState();

  const {
    isOpen: isHarvestOpen,
    onOpen: onHarvestOpen,
    onClose: onHarvestClose,
  } = useDisclosure();
  const [userInfo, setUserInfo] = useState(InitUserInfo);
  const [poolInfo, setPoolInfo] = useState(pool);
  const block = useBlock();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const account = useSelector((state) => state.authUser.address);
  const userPoolList = useSelector((state) => state.authUser.userPoolList);
  const [updateLoading, updater2] = useUpdater2(account);

  useEffect(() => {
    if (userPoolList) {
      setUserInfo(userPoolList[pid] || InitUserInfo);
    } else {
      setUserInfo(InitUserInfo);
    }
  }, [pid, userPoolList]);

  useEffect(() => {
    setPoolInfo(pool);
  }, [pool]);

  const validateAmount = () => {
    if (!amount || !userInfo) {
      setAmountError(MSG_NO_CURRENCY);
      return;
    }

    if (amount.lte(0) || amount.isNaN()) {
      setAmountError(MSG_AMOUNT_REQUIRED);
      return;
    }

    if (
      (isStableSelected && amount.gt(userInfo.wallet)) ||
      (!isStableSelected && amount.gt(userInfo.walletLPAmount))
    ) {
      setAmountError(MSG_AMOUNT_EXCEEDED);
      return;
    }
    setAmountError("");
    return true;
  };

  const handleConfirmOpen = async () => {
    if (confirmLoading) {
      return;
    }

    if (!validateAmount()) return;

    if (!isStableSelected) {
      onConfirmOpen();
      return;
    }

    setConfirmLoading(true);

    const xfaiContract = getXfaiContract();

    try {
      const res = await xfaiContract.methods
        .getEstimatedLPTokens(
          `0x${bnMultipledByDecimals(amount, poolInfo.stableDecimals)
            .dp(0)
            .toString(16)}`,
          poolInfo.stableAddress,
          poolInfo.lpAddress
        )
        .call();
      setRightAmount(bnDivdedByDecimals(res));
      onConfirmOpen();
      setConfirmLoading(false);
    } catch (error) {
      setConfirmLoading(false);
      console.log("error :>> ", error);
    }
  };

  const handleMaxAmount = useCallback(() => {
    setAmount(isStableSelected ? userInfo.wallet : userInfo.walletLPAmount);
  }, [isStableSelected, userInfo]);

  const handleApproveAmount = async () => {
    setConfirmLoading(true);
    if (isStableSelected) {
      const tokenContract = getERC20Contract(poolInfo.stableAddress);
      tokenContract.methods
        .approve(
          xfaiAddress[networkId],
          `0x${bnMultipledByDecimals(amount, poolInfo.stableDecimals)
            .dp(0)
            .toString(16)}`
        )
        .send({from: account})
        .on("transactionHash", (hash) => {
          console.log("hash :>> ", hash);
          // NotificationManager.info("Transaction Submitted!");
        })
        .on("receipt", (receipt) => {
          setConfirmLoading(false);
          // NotificationManager.success("Approve Success!");
          handleFarm();
        })
        .on("error", (err, receipt) => {
          // NotificationManager.error("Approve Denied!");
          setConfirmLoading(false);
          setIsProgress(false);
        });
    } else {
      const lpContract = getLPContract(poolInfo.lpAddress);
      lpContract.methods
        .approve(
          xfaiAddress[networkId],
          `0x${bnMultipledByDecimals(amount).dp(0).toString(16)}`
        )
        .send({from: account})
        .on("transactionHash", (hash) => {
          console.log("hash :>> ", hash);
          // NotificationManager.info("Transaction Submitted!");
        })
        .on("receipt", (receipt) => {
          setConfirmLoading(false);
          // NotificationManager.success("Approve Success!");
          handleFarm();
        })
        .on("error", (err, receipt) => {
          // NotificationManager.error("Approve Denied!");
          setConfirmLoading(false);
          setIsProgress(false);
        });
    }
  };

  const handleApproveZero = async () => {
    setConfirmLoading(true);
    if (isStableSelected) {
      const tokenContract = getERC20Contract(poolInfo.stableAddress);
      tokenContract.methods
        .approve(xfaiAddress[networkId], 0)
        .send({from: account})
        .on("transactionHash", (hash) => {
          console.log("hash :>> ", hash);
          // NotificationManager.info("Transaction Submitted!");
        })
        .on("receipt", (receipt) => {
          setConfirmLoading(false);
          // NotificationManager.success("Approve Success!");
          handleApproveAmount();
        })
        .on("error", (err, receipt) => {
          // NotificationManager.error("Approve Denied!");
          setConfirmLoading(false);
          setIsProgress(false);
        });
    } else {
      const lpContract = getLPContract(poolInfo.lpAddress);
      lpContract.methods
        .approve(xfaiAddress[networkId], 0)
        .send({from: account})
        .on("transactionHash", (hash) => {
          console.log("hash :>> ", hash);
          // NotificationManager.info("Transaction Submitted!");
        })
        .on("receipt", (receipt) => {
          setConfirmLoading(false);
          // NotificationManager.success("Approve Success!");
          handleApproveAmount();
        })
        .on("error", (err, receipt) => {
          // NotificationManager.error("Approve Denied!");
          setConfirmLoading(false);
          setIsProgress(false);
        });
    }
  };

  const handleFarm = useCallback(async () => {
    const xfaiContract = getXfaiContract();
    setConfirmLoading(true);
    if (isStableSelected) {
      xfaiContract.methods
        .depositLPWithToken(
          pid,
          `0x${bnMultipledByDecimals(amount, poolInfo.stableDecimals)
            .dp(0)
            .toString(16)}`,
          // `0x${bnMultipledByDecimals(rightAmount.times(0.96)).dp(0).toString(16)}`
          1
        )
        .send({from: account})
        .on("transactionHash", (hash) => {
          console.log("hash :>> ", hash);
          // NotificationManager.info("Transaction Submitted!");
          onConfirmClose();
        })
        .on("receipt", (receipt) => {
          updater2();
          setAmount(new BigNumber(-1));
          // NotificationManager.success("Stake Success!");
          setConfirmLoading(false);
          setIsProgress(false);
        })
        .on("error", (err, receipt) => {
          setIsProgress(false);
          setConfirmLoading(false);
          NotificationManager.error("Stake Denied!");
        });
    } else {
      xfaiContract.methods
        .depositLP(
          pid,
          `0x${bnMultipledByDecimals(amount, 18).dp(0).toString(16)}`
        )
        .send({from: account})
        .on("transactionHash", (hash) => {
          console.log("hash :>> ", hash);
          // NotificationManager.info("Transaction Submitted!");
          onConfirmClose();
        })
        .on("receipt", (receipt) => {
          updater2();
          setAmount(new BigNumber(-1));
          NotificationManager.success("Stake Success!");
          setConfirmLoading(false);
          setIsProgress(false);
        })
        .on("error", (err, receipt) => {
          setIsProgress(false);
          setConfirmLoading(false);
          NotificationManager.error("Stake Denied!");
        });
    }
  }, [isStableSelected, pid, amount, poolInfo, account]);

  const handleYes = async () => {
    setIsProgress(true);
    onConfirmClose();
    let allowance;
    if (isStableSelected) {
      const tokenContract = getERC20Contract(poolInfo.stableAddress);
      allowance = await tokenContract.methods
        .allowance(account, xfaiAddress[networkId])
        .call();
      allowance = bnDivdedByDecimals(allowance, poolInfo.stableDecimals);
    } else {
      const lpContract = getLPContract(poolInfo.lpAddress);
      allowance = await lpContract.methods
        .allowance(account, xfaiAddress[networkId])
        .call();
      allowance = bnDivdedByDecimals(allowance);
    }
    if (allowance.isZero()) {
      handleApproveAmount();
    } else if (allowance.lt(amount)) {
      handleApproveZero();
    } else {
      handleFarm();
    }
  };

  const handleSelect = (value) => {
    setIsStableSelected(value);
    setShowSelect(false);
    setAmount(new BigNumber(-1));
  };

  const visibleMainPool = !isConfirmOpen && !isHarvestOpen && !isProgress;

  return (
    <>
      {isProgress || updateLoading ? (
        <Box
          className={`box-pool loading`}
          bg="#1A1A1A"
          borderRadius={20}
          margin={5}
          py={6}
        >
          <LoadingFarm body={updateLoading ? LOADING_TEXT_UPDATE : null}/>
        </Box>
      ) : (
        <Box
          className={`box-pool pool${visibleMainPool ? "" : " hide"}`}
          bg="#1A1A1A"
          borderRadius={20}
          margin={5}
          py={5}
        >
          <Heading
            as="h4"
            textAlign="center"
            fontSize={32}
            fontFamily="EuclidCircularA"
          >
            <StyledTitle>{`${poolInfo.stableSymbol} + XFIT`}</StyledTitle>
          </Heading>
          <Box bg="#262626" w="#262626" marginTop={5} padding={2} className="box-tvl">
            <Flex justify="center">
              <Text textAlign="center" fontFamily="EuclidCircularA">
                TVL: {nf(poolInfo.tvl.times(poolInfo.lpPrice), 0, 6)}
              </Text>
              <Tooltip sid={`tvl${pid}`} label="Total Value Locked – Represents the total amount of funds in terms of USD inside a liquidity pool."/>
            </Flex>
          </Box>
          <Box padding={5}>
            <Flex className="row-staked">
              <Box className="staked">
                <Flex className="box-title">
                  <Text fontFamily="EuclidCircularA">
                    Staked <span style={{fontSize: 13}}>(USD)</span>
                  </Text>
                  <Tooltip sid={`staked${pid}`} label="Displays the amount you have staked in this liquidity pool as the USD equivalent of your LP tokens. LP tokens are paired tokens, one is the currency of the pool and the other is XFIT"/>
                </Flex>
                <Text
                  fontFamily="EuclidCircularA"
                  color="#FC307B"
                  textAlign="left"
                  className="box-value"
                >
                  ${testValue ? "99,999,999.999" : nf(userInfo.stakedLPAmount.times(poolInfo.lpPrice), 0)}
                </Text>
                <Flex className="box-value-desc">
                  <Text
                    color="#999999"
                    fontFamily="EuclidCircularA"
                    marginTop={1}
                    textAlign="left"
                  >
                    {`(${
                      userInfo.stakedLPAmount.isZero()
                        ? 0
                        : userInfo.stakedLPAmount.lt(0.001)
                        ? "0.0..." +
                        userInfo.stakedLPAmount.toString(10).slice(-3)
                        : nf(userInfo.stakedLPAmount, 0)
                    } LP Tokens)`}
                  </Text>
                  <Tooltip
                    label={`${nf(
                      userInfo.stakedLPAmount,
                      0,
                      18,
                      18
                    )} LP Tokens – Displays the amount you have staked in this liquidity pool in the form of LP tokens. LP tokens are paired tokens, one is the currency of the pool and the other is XFIT.`}
                  />
                </Flex>
              </Box>

              <Box className="xfit">
                <Flex className="box-title">
                  <Text fontFamily="EuclidCircularA">XFIT earned</Text>
                  <Tooltip label="This displays the total amount you have earned in this pool for the current session."/>
                </Flex>
                <Text
                  className="box-value"
                  fontFamily="EuclidCircularA"
                  color="#A22DC9"
                  textAlign="left"
                >
                  {testValue ? '999.999' : nf(userInfo.xfitEarned, 0, 3, 3, true)}
                </Text>
                <Text
                  color="#999999"
                  fontFamily="EuclidCircularA"
                  className="box-value-desc"
                  mt={1}
                  textAlign="left"
                >
                  ($
                  {testValue ? '99,999,999.999' : nf(userInfo.xfitEarned.times(poolInfo.xfitPrice), 0)})
                </Text>
              </Box>
            </Flex>
            <Divider borderColor="#333" opacity={1}/>
            <Flex mt={5} justify="space-between" flexWrap="wrap" className="box-value-wallet">
              <StyledSelect>
                <div className="label" onClick={() => setShowSelect(true)}>
                  {isStableSelected ? (
                    <>
                      Wallet: {nf(userInfo.wallet, 0)} {poolInfo.stableSymbol}
                    </>
                  ) : (
                    <>Wallet: {nf(userInfo.walletLPAmount, 0, 18)} LP</>
                  )}
                  <img src={dropdown} alt="dropdown"/>
                </div>
                {showSelect && (
                  <div className="popupSelect" ref={wrapperRef}>
                    <div
                      className={`item ${isStableSelected && "selected"}`}
                      onClick={() => handleSelect(true)}
                    >
                      {isStableSelected && (
                        <img src={checkmark} alt="check mark"/>
                      )}
                      <span>
                        {nf(userInfo.wallet, 0)} {poolInfo.stableSymbol}
                      </span>
                    </div>
                    <div
                      className={`item ${!isStableSelected && "selected"}`}
                      onClick={() => handleSelect(false)}
                    >
                      {!isStableSelected && (
                        <img src={checkmark} alt="check mark"/>
                      )}
                      <span>
                        {nf(userInfo.walletLPAmount, 0, 18)} LP
                      </span>
                    </div>
                  </div>
                )}
              </StyledSelect>
              {/* <Text fontSize={13}>
                Wallet: {nf(userInfo.walletLPAmount, 0, 18)} LP Tokens
              </Text> */}
              <StyledMax onClick={handleMaxAmount}>
                <Text color="#5FD9DD" fontSize={13}>
                  Max
                </Text>
              </StyledMax>
            </Flex>

            <StyledAmountWrap>
              <StyledInput className={`input-wrap${amountError ? ' error' : ''}`}>
                <NumberFormat
                  value={amount.lt(0) ? "" : amount.toString(10)}
                  onValueChange={(values) => {
                    const {value} = values;
                    setAmount(new BigNumber(value));

                    // validation again
                    // if (amountError) {
                    //   validateAmount();
                    // }
                  }}
                  thousandSeparator
                  allowNegative={false}
                  placeholder={
                    account && userInfo.wallet.gt(0)
                      ? "Enter amount"
                      : "Currency required"
                  }
                />
                <span className={`max${amount.lt(0) ? " hide" : ""}`}>
                  {isStableSelected ? poolInfo.stableSymbol : "LP Tokens"}
                </span>
              </StyledInput>
              <StyledInputHelpDiv className="help-block">
                {amountError}
              </StyledInputHelpDiv>
            </StyledAmountWrap>
            {!account ? (
              <ConnectWalletModal isBody/>
            ) : (userInfo.stakedLPAmount.isZero() ? (
              <StyledButton className="sb" onClick={handleConfirmOpen}>
                Farm
              </StyledButton>
            ) : (
              <Flex align="center" justify="space-between">
                <StyledButton
                  onClick={onHarvestOpen}
                  className="blue"
                  style={{marginRight: 15}}
                >
                  Harvest
                </StyledButton>
                <StyledButton
                  onClick={(e) => {
                    handleConfirmOpen();
                  }}
                  style={{marginLeft: 15, letterSpacing: -1}}
                >
                  Add to farm
                </StyledButton>
              </Flex>
            ))}
          </Box>
          <PoolDetails userInfo={userInfo} poolInfo={poolInfo}/>
        </Box>
      )}

      <AddToFarm
        stableSymbol={poolInfo.stableSymbol}
        amount={amount}
        rightAmount={rightAmount}
        isOpen={isConfirmOpen && !isProgress}
        onClose={onConfirmClose}
        handleYes={handleYes}
        confirmLoading={confirmLoading}
        isStableSelected={isStableSelected}
        lpPrice={poolInfo.lpPrice}
      />

      <Harvest
        isOpen={isHarvestOpen}
        onClose={onHarvestClose}
        pid={pid}
        harvestLoading={harvestLoading}
        withdrawLoading={withdrawLoading}
      />
    </>
  );
};

export const LOADING_TEXT_UPDATE = (
  <>
    <Text
      color="white"
      fontFamily="EuclidCircularA"
      fontSize={28}
      textAlign="center"
      marginTop={{base: 4}}
      marginBottom={{base: 4}}
    >
      Please wait while we {" "}
      <span style={{color: "#5FD9DD"}}>update your info</span>
    </Text>
  </>
);

export const LOADING_TEXT_HARVEST = (
  <>
    <Text
      color="white"
      fontFamily="EuclidCircularA"
      fontSize={28}
      textAlign="center"
      marginTop={{base: 4}}
      marginBottom={{base: 4}}
    >
      Please wait while we complete your {" "}
      <span style={{color: "#5FD9DD"}}> Harvesting transaction</span>
    </Text>
  </>
);

export const LOADING_TEXT_UNSTAKE = (
  <>
    <Text
      color="white"
      fontFamily="EuclidCircularA"
      fontSize={28}
      textAlign="center"
      marginTop={{base: 4}}
      marginBottom={{base: 4}}
    >
      Please wait while we complete your{" "}
      <span style={{color: "#5FD9DD"}}>
        Harvesting transaction
      </span>
    </Text>
  </>
);
