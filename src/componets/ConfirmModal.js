import React from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  Box,
  Flex,
} from "@chakra-ui/react";
import { StyledButton } from "./Button";
import { formatDecimal, nf } from "../xfai/utils";

export const ConfirmModal = ({
  stableSymbol,
  amount,
  rightAmount,
  isOpen,
  onClose,
  handleYes,
  confirmLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={20} maxW={400} bg="#1A1A1A">
        <ModalBody pt={120} pb={50} px="0" borderRadius={20}>
          <Box>
            <Text fontSize={34} textAlign="center">
              Stake{" "}
              <span style={{ color: "#FC307B" }}>
                {nf(amount, 0)}
              </span>{" "}
              {stableSymbol}?
            </Text>
          </Box>
          <Box>
            <Text fontSize={18} textAlign="center" mt={90}>
              This is the estimated equivalent of:
            </Text>
          </Box>
          <Text
            bgColor="#262626"
            fontSize={23}
            textAlign="center"
            mt={2}
            ml={-2}
            mr={-2}
            px={17}
            py={25}
          >
            {nf(rightAmount, 0, 18)}{" "}
            <span style={{ fontSize: 13 }}>LP TOKENS</span>
          </Text>

          <Flex align="center" justify="space-between" mt={55} mx={5}>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
