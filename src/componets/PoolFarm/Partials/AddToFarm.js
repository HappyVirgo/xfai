import React from "react";
import { Text, Box, Flex } from "@chakra-ui/react";
import { StyledButton } from "../../Button";
import { formatDecimal, nf } from "../../../xfai/utils";

export const AddToFarm = ({
  stableSymbol,
  amount,
  rightAmount,
  isOpen,
  onClose,
  handleYes,
  confirmLoading,
  isStableSelected,
  lpPrice,
}) => {
  return (
    <Box
      className={`box-pool${isOpen ? "" : " hide"}`}
      bg="#1A1A1A"
      borderRadius={20}
      margin={5}
      py={6}
      px={{ base: 5 }}
    >
      <Box>
        <Text fontSize={34} textAlign="center">
          Stake{" "}
          <span style={{ color: "#FC307B" }}>
            {formatDecimal(amount, 0, 18)}
          </span>{" "}
          {isStableSelected ? stableSymbol : "LP Tokens"}?
        </Text>
      </Box>
      <Box>
        <Text fontSize={18} textAlign="center" mt={20}>
          This is the estimated equivalent of:
        </Text>
      </Box>
      <Text
        bgColor="#262626"
        fontSize={23}
        textAlign="center"
        mt={2}
        px={17}
        py={25}
      >
        {isStableSelected ? (
          <>
            {nf(rightAmount, 0, 18)}{" "}
            <span style={{ fontSize: 13 }}>LP Tokens</span>
          </>
        ) : (
          <>
            {nf(amount.times(lpPrice), 0, 18)}{" "}
            <span style={{ fontSize: 13 }}>USD</span>
          </>
        )}
      </Text>

      <Box>
        <Text fontSize={18} textAlign="center" mt={10}>
          Adding to your current form will harvest all of your earned XFIT
        </Text>
      </Box>

      <Flex align="center" justify="space-between" mt={10} mx={5}>
        <StyledButton
          onClick={onClose}
          className="blue"
          style={{ marginRight: 15 }}
        >
          No
        </StyledButton>
        <StyledButton
          onClick={handleYes}
          style={{ marginLeft: 15 }}
          className={`${confirmLoading ? "disabled" : ""}`}
        >
          Yes
        </StyledButton>
      </Flex>
    </Box>
  );
};