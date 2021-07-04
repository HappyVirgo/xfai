import {Flex, Box, Text} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
import {StyledButton} from "../../../componets/Button";
import {useSelector} from "react-redux";
import {getXfaiContract} from "../../../xfai/contracts";
import {NotificationManager} from "react-notifications";
import {nf} from "../../../xfai/utils";
import {LoadingFarm} from "../../../componets/LoadingFarm";
import {LOADING_TEXT_HARVEST} from "../PoolFarm";


export const HarvestRewards = ({
                                   pid,
                                   onClose,
                                   onCloseHarvest, // harvest success callback.,
                               }) => {
    const [harvestLoading, setHarvestLoading] = useState(false);
    const account = useSelector((state) => state.authUser.address);
    const userPoolList = useSelector((state) => state.authUser.userPoolList);

    const onNo = () => {
        onClose();
    };

    const onYes = () => {
        const xfaiContract = getXfaiContract();

        setHarvestLoading(true);
        xfaiContract.methods
            .withdrawLP(pid, 0)
            .send({from: account})
            .on("transactionHash", (hash) => {
                console.log("hash :>> ", hash);
                // NotificationManager.info("Transaction Submitted!");
            })
            .on("receipt", (receipt) => {
                setHarvestLoading(false);
                // NotificationManager.success("Harvest Success!");
                onCloseHarvest();
            })
            .on("error", (err, receipt) => {
                setHarvestLoading(false);
                // NotificationManager.error("Harvest Denied!");
            });
    };

    const visibleLoadingForm = harvestLoading;

    return (
        <>
            {visibleLoadingForm ? (
                <LoadingFarm body={LOADING_TEXT_HARVEST}/>
            ) : (
                <>
                    <Box pt={'145px'}>
                        <Text textAlign="center" fontSize={28} mx={'-20px'}>Harvest XFIT rewards?</Text>
                    </Box>
                    <Box bg="#262626" py={3} mt={5} mx={'-20px'}>
                        <Text textAlign="center" fontSize={18}>
                                <span style={{fontSize: 36, color: "#FC307B"}}>
                                  {userPoolList && nf(userPoolList[pid]["xfitEarned"], 0)}
                                </span>{" "} XFIT
                        </Text>
                    </Box>
                    <Flex align="center" justify="space-between" pt={120} px={5}>
                        <StyledButton
                            onClick={onNo}
                            className="blue"
                            style={{marginRight: 15}}
                        >
                            No
                        </StyledButton>
                        <StyledButton
                            onClick={onYes}
                            className={`${harvestLoading ? "disabled" : ""}`}
                            style={{marginLeft: 15}}
                        >
                            Yes
                        </StyledButton>
                    </Flex>
                </>
            )}
        </>
    );
};
