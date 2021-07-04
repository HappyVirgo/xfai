import React, { useState } from "react";
import {
  Text,
  Box,
  VStack,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { StyledButton } from "../../Button";
import { formatDecimal } from "../../../xfai/utils";
import { useSelector } from "react-redux";
import { HarvestRewards } from "./HarvestRewards";
import { HarvestRewardsSuccess } from "./HarvestRewardsSuccess";
import { HarvestUnstake } from "./HarvestUnstake";
import { HarvestUnstakeSuccess } from "./HarvestUnstakeSuccess";

export const HARVEST_ENTRY = 1;
export const HARVEST_REWARD = 2;
export const HARVEST_REWARD_SUCCESS = 3;

export const HARVEST_UNSTAKE = 10;
export const HARVEST_UNSTAKE_SUCCESS = 11;

export const Harvest = ({
                          isOpen,
                          onClose,
                          pid,
                          harvestLoading,
                          withdrawLoading,
                        }) => {

  const [step, setStep] = useState(HARVEST_ENTRY);
  // staked percentage.
  const [unstakePercent, setUnstakePercent] = useState(0);

  let box = '';
  switch (step) {
    case HARVEST_REWARD:
      box = (
        <HarvestRewards
          pid={pid}
          onCloseHarvest={() => setStep(HARVEST_REWARD_SUCCESS)}
          onClose={() => setStep(HARVEST_ENTRY)}
        />
      );
      break;
    case HARVEST_REWARD_SUCCESS:
      box = (
        <HarvestRewardsSuccess
          pid={pid}
          onClose={() => {
            setStep(HARVEST_ENTRY);
            onClose();
          }}
        />
      );
      break;

    case HARVEST_UNSTAKE:
      box = (
        <HarvestUnstake
          pid={pid}
          onCloseHarvest={(percent) => {
            setUnstakePercent(percent);
            setStep(HARVEST_UNSTAKE_SUCCESS)
          }}
          onClose={() => setStep(HARVEST_ENTRY)}
          setUnstakePercent={setUnstakePercent}
        />
      );
      break;
    case HARVEST_UNSTAKE_SUCCESS:
      box = (
        <HarvestUnstakeSuccess
          pid={pid}
          onClose={() => {
            setStep(HARVEST_ENTRY);
            onClose();
          }}
          percent={unstakePercent}
        />
      );
      break;

    case HARVEST_ENTRY:
      box = (
        <>
          <Box>
            <CloseButton style={{fontSize: 24, marginLeft: 'auto'}} onClick={onClose} />
          </Box>
          <Box style={{marginTop: 50}}>
            <Text fontSize={28} textAlign="center">
              Harvest only XFIT rewards
            </Text>
          </Box>

          <VStack spacing={6} mt={5}>
            <StyledButton
              onClick={() => setStep(HARVEST_REWARD)}
              className={`${harvestLoading ? "disabled" : ""}`}
            >
              {harvestLoading ? "Harvesting..." : "Harvest XFIT"}
            </StyledButton>
            <Text textAlign="center" fontSize={19}>
              Harvest accumulated rewards and withdraw funds from the liquidity pool
            </Text>

            <StyledButton
              onClick={() => setStep(HARVEST_UNSTAKE)}
              className={`blue ${withdrawLoading ? "disabled" : ""}`}
            >
              {withdrawLoading ? "Unstaking..." : "Harvest XFIT & unstake"}
            </StyledButton>
          </VStack>
        </>
      );
      break;
  }

  return (
    <Box className={`box-pool${isOpen ? '' : ' hide'}`} bg="#1A1A1A" borderRadius={20} margin={5} py={6} px={{base: 5}}>
      {box}
    </Box>
  );
};
