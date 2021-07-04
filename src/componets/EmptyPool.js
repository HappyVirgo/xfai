import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Divider,
  HStack,
  Link,
  Collapse,
} from "@chakra-ui/react";
import { AiFillPlusCircle } from "react-icons/ai";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import BigNumber from "bignumber.js";
import NumberFormat from "react-number-format";
import Tooltip from "./Tooltip";
import { ConnectWalletModal } from "./ConnectWalletModal";
import { StyledButton } from "./Button";
import { StyledAmountWrap, StyledInput, StyledTitle, StyledInputHelpDiv } from "./PoolFarm/Styles";
import { isLoggedIn } from "../xfai/AuthUtil";
import { useSelector } from "react-redux";

const PoolDetails = () => {
  const [disclose, setDisclode] = useState(false);
  const toggleDisclose = () => {
    setDisclode(!disclose);
  };
  const renderDetails = () => {
    return (
      <Collapse in={disclose} animateOpacity>
        <Box mt={4} className="pool-box-detail">
          <Flex bg="#262626" paddingY={2} paddingX={5} justify="space-between">
            <HStack>
              <Text fontSize={14}>Staked:</Text>
              <Tooltip label="0 – Displays the amount you have staked in this liquidity pool in the form of LP tokens. LP tokens are paired tokens, one is the currency of the pool and the other is XFIT."/>
            </HStack>
            <Text fontSize={14} textAlign="right" className="values">0 LP tokens ($0)</Text>
          </Flex>

          <Flex paddingY={2} paddingX={5} justify="space-between">
            <HStack>
              <Text fontSize={14}>XFIT earned:</Text>
              <Tooltip label="This displays the total amount you have earned in this pool for the current session."/>
            </HStack>
            <Text fontSize={14} textAlign="right" className="values">0 XFIT ($0)</Text>
          </Flex>

          <Flex bg="#262626" paddingY={2} paddingX={5} justify="space-between">
            <HStack>
              <Text fontSize={14}>Rewards harvested:</Text>
              <Tooltip label="The total number of XFIT tokens harvested from this pool for the current session."/>
            </HStack>
            <Text fontSize={14} textAlign="right" className="values">0 XFIT ($0)</Text>
          </Flex>

          <Flex paddingY={2} paddingX={5} justify="space-between">
            <HStack>
              <Text fontSize={14}>Pool share:</Text>
              <Tooltip label="Represents the percentage of how much you have staked in the pool compared to others."/>
            </HStack>
            <Text fontSize={14}>0%</Text>
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

export const EmptyPool = ({stableSymbol, account = null}) => {
  const [amount, setAmount] = useState(new BigNumber(-1));
  const [error, setError] = useState('');
  const loggedIn = useSelector((state) => state.authUser.loggedIn);

  return (
    <Box
      className={`box-pool pool`}
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
        <StyledTitle>{`${stableSymbol} + XFIT`}</StyledTitle>
      </Heading>
      <Box bg="#262626" w="#262626" marginTop={5} padding={2} className="box-tvl">
        <Flex justify="center">
          <Text
            textAlign="center"
            fontFamily="EuclidCircularA"
          >
            {`TVL : - `}
          </Text>
          <Tooltip label="Total Value Locked - Represents the total amount of funds in terms of USD inside a liquidity pool."/>
        </Flex>
      </Box>
      <Box padding={5}>
        <Flex className="row-staked">
          <Box className="staked">
            <Flex className="box-title">
              <Text fontFamily="EuclidCircularA">
                Staked <span style={{fontSize: 13}}>(USD)</span>
              </Text>
              <Tooltip label="Displays the amount you have staked in this liquidity pool as the USD equivalent of your LP tokens. LP tokens are paired tokens, one is the currency of the pool and the other is XFIT."/>
            </Flex>
            <Text
              fontFamily="EuclidCircularA"
              color="#FC307B"
              textAlign="left"
              className="box-value"
            >
              $0
            </Text>
            <Flex
              className="box-value-desc"
            >
              <Text
                color="#999999"
                fontFamily="EuclidCircularA"
                marginTop={1}
                textAlign="left"
              >
                {`(0 LP Tokens)`}
              </Text>
              <Tooltip label="0 LP tokens – Displays the amount you have staked in this liquidity pool in the form of LP tokens. LP tokens are paired tokens, one is the currency of the pool and the other is XFIT."/>
            </Flex>
          </Box>
          <Box className="xfit">
            <Flex className="box-title">
              <Text fontFamily="EuclidCircularA">
                XFIT earned
              </Text>
              <Tooltip label="This displays the total amount you have earned in this pool for the current session."/>
            </Flex>
            <Text
              className="box-value"
              fontFamily="EuclidCircularA"
              color="#A22DC9"
              textAlign="left"
            >
              0
            </Text>
            <Text
              color="#999999"
              fontFamily="EuclidCircularA"
              className="box-value-desc"
              mt={1}
              textAlign="left"
            >
              ($0)
            </Text>
          </Box>
        </Flex>
        <Divider borderColor="#333" opacity={1}/>
        <Flex mt={5} justify="space-between" flexWrap="wrap" className="box-value-wallet">
          <Text>Wallet: 0 {stableSymbol}</Text>
          <HStack align="center" cursor="pointer" className="tns-blue">
            <Text color="#5FD9DD">
              Max
            </Text>
          </HStack>
        </Flex>

        <StyledAmountWrap>
          <StyledInput className={`input-wrap`}>
            <NumberFormat

              value={amount.lt(0) ? "" : amount.toString(10)}
              onValueChange={(values) => {
                const {value} = values;
                if (!value) {
                  setAmount(new BigNumber(-1));
                  return;
                }
                setAmount(new BigNumber(value));
              }}
              isAllowed={({value}) => {
                return new BigNumber(value || 0).lt(new BigNumber(0));
              }}
              thousandSeparator
              allowNegative={false}
              placeholder="Enter amount"
            />
            <span className="max hide">{stableSymbol}</span>
          </StyledInput>
          {!!error&&<StyledInputHelpDiv className="help-block">
              {error}
            </StyledInputHelpDiv>
          }
        </StyledAmountWrap>
        {account && loggedIn ? (
          <StyledButton onClick={() => setError('! The currency required for this pool is not in your wallet')}>Farm</StyledButton>
        ) : (
          <ConnectWalletModal isBody/>
        )}
      </Box>
      <PoolDetails/>
    </Box>
  );
};
