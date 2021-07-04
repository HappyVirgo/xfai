import React from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  Box,
  VStack,
} from "@chakra-ui/react";
import { StyledButton } from "./Button";

export const HarvestModal = ({
  isOpen,
  onClose,
  handleHarvest,
  handleUnstake,
  harvestLoading,
  withdrawLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={20} maxW={400}>
        <ModalCloseButton size="lg" />
        <ModalBody
          bg="#1A1A1A"
          py={20}
          borderRadius={20}
          style={{ paddingTop: "30%" }}
        >
          <Box>
            <Text fontSize={28} textAlign="center">
              Harvest only XFIT rewards
            </Text>
          </Box>

          <VStack spacing={6} mt={5}>
            <StyledButton
              onClick={handleHarvest}
              className={`${harvestLoading ? "disabled" : ""}`}
            >
              {harvestLoading ? "Harvesting..." : "Harvest XFIT"}
            </StyledButton>
            <Text textAlign="center" fontSize={19}>
              Harvest accumulated rewards and withdraw funds from the liquidity
              pool
            </Text>

            <StyledButton
              onClick={handleUnstake}
              className={`blue ${withdrawLoading ? "disabled" : ""}`}
            >
              {withdrawLoading ? "Unstaking..." : "Harvest XFIT & unstake"}
            </StyledButton>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
