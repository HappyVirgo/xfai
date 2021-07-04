import { Box, Container, Flex, Heading, Text, Spinner, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PoolFarm } from "../../componets/PoolFarm/PoolFarm";
import { Grid, Row, Col } from "react-flexbox-grid";
import { useSelector } from "react-redux";
import { formatDecimal, nf } from "../../xfai/utils";
import Tooltip from "../../componets/Tooltip";
import { EmptyPool } from "../../componets/EmptyPool";
import './index.css';
import { isLoggedIn } from "../../xfai/AuthUtil";

export const Farm = () => {
  const account = useSelector((state) => state.authUser.address);
  const currentAPY = useSelector((state) => state.authUser.currentAPY);
  const currentAPR = useSelector((state) => state.authUser.currentAPR);
  const poolList = useSelector((state) => state.authUser.poolList);
  const userTotalInfo = useSelector((state) => state.authUser.userTotalInfo);
  const curNetworkId = useSelector((state) => state.authUser.networkId);

  useEffect(() => {
  }, []);

  const renderInfo = () => {
    if (account) {
      return (
        <Flex
          justify="center"
          flexWrap="wrap"
          marginTop={4}
          marginBottom={{base: "20px", md: "30px", lg: "40px"}}
        >
          <Text fontSize={16} fontFamily="EuclidCircularA">
            Total rewards
            <span style={{color: "#FC307B", fontWeight: "bold", marginLeft: 3}}>
              {userTotalInfo && userTotalInfo.userTotalRewards
                ? formatDecimal(userTotalInfo.userTotalRewards, 0, 6)
                : 0}
            </span>{" "}
            <span
              style={{fontWeight: "normal", color: "#FC307B", fontSize: 14}}
            >
              XFIT
            </span>{" "}
            ($
            <span style={{fontWeight: "bold"}}>
              {formatDecimal(
                userTotalInfo && userTotalInfo.userTotalRewardsInUSD
                  ? userTotalInfo.userTotalRewardsInUSD
                  : 0,
                0,
                8
              )}
            </span>
            )
          </Text>
          <Tooltip sid={22} label={"XFIT - Displays the total XFIT tokens you have earned for all pools in the current session."}></Tooltip>
        </Flex>
      );
    }

    return (
      <Text fontSize={16} mt={5} textAlign="center" px={10}>
        You will need a crypto wallet in order to farm with XFai.
        <br/> New to crypto farming?{" "}
        <span
          onClick={() => {
            window.open(
              "https://xfai-official.medium.com/xfai-guide-to-farming-one-click-500-apy-19c59da14055",
              "_blank"
            );
          }}
          className="learn-more"
          style={{color: "#5FD9DD", cursor: "pointer"}}
        >
          Learn more
        </span>
        .
      </Text>
    );
  };

  const renderPools = () => {
    // Todo Later we can uncomment a line above and comment codes below.
    const extra = parseInt(new URLSearchParams(window.location.search).get("extra"));
    const countPools = (isNaN(extra) ? 0 : extra) + (poolList ? poolList.length : 0);
    const extraPools = [];
    for (let i=0; i < extra; i++) {
      extraPools.push(<EmptyPool
        key={i}
        stableSymbol={"-USDT"}
        account={account}
      />);
    }

    if (account && isLoggedIn(curNetworkId, account)) {
      return (
        <Row className="pool-box-row" style={{alignItems: "flex-start", justifyContent: countPools >= 3 ? "flex-start" : "center"}}>
          {poolList.length > 0
            ? poolList.map((pool, index) => (
              <PoolFarm key={index} pid={pool.pid} pool={pool}/>
            ))
            : ["USDT", "USDC"].map((stableSymbol, index) => (
              <EmptyPool
                key={index}
                stableSymbol={stableSymbol}
                account={account}
              />
            ))}
          {extra > 0 && extraPools}
        </Row>
      );
    }

    return (
      <Row className="pool-box-row" center="xs" style={{alignItems: "flex-start"}}>
        {["USDT", "USDC"].map((stableSymbol, index) => (
          <EmptyPool key={index} stableSymbol={stableSymbol} account={account}/>
        ))}
      </Row>
    );
  };

  // Todo Later we can uncomment a line above and comment codes below.
  const extra = parseInt(new URLSearchParams(window.location.search).get("extra"));
  const countPools = (isNaN(extra) ? 0 : extra) + (poolList ? poolList.length : 0);

  return (
    <Box style={{marginTop: 0}} className={`container-wrap${countPools < 3 ? ' mod2': ' mod3'}`}>
      <Box textAlign="center">
        <Text
          textAlign="center"
          textTransform="uppercase"
          fontFamily="Gobold"
          fontWeight="normal"
          marginTop={{base: "0px"}}
          display="inline-block"
          className="top-heading"
        >
          <span style={{color: "#FC307B"}}>Farm</span> our liquidity pools
          <Tooltip label="Liquidity pools are smart contracts that contain funds. Liquidity providers (LP)  get rewarded in tokens (XFIT) for providing liquidity."></Tooltip>
        </Text>
      </Box>
      <Flex justify="center">
        <Box
          bg="#333333"
          borderRadius={10}
          width="fit-content"
          paddingLeft={10}
          paddingRight={10}
          className={"heading-apr-wrap"}
        >
          <Flex gridGap={0}>
            <Text
              className="heading-apr"
              fontWeight="normal"
            >
              Current APR: {" "}
              {account ? (
                <span style={{color: "#5FD9DD"}}>
                  {!currentAPR ? 0 : nf(currentAPR, 0, 4)}%
                </span>
              ) : (
                "-"
              )}
            </Text>
            <Tooltip sid={'apr'} label="Annual Percentage Rate - Shows the interest rate for a period of one year."></Tooltip>
          </Flex>
        </Box>
      </Flex>
      {renderInfo()}
      <div className="pool-box-wrap">
        {renderPools()}
      </div>
    </Box>
  );
};
