import {Flex, Box, Text, Button} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {HiCheckCircle} from "react-icons/hi";
import {useSelector} from "react-redux";
import {formatDecimal, nf} from "../../../xfai/utils";
import {StyledButton} from "../../Button";
import useUpdater2 from "../../../hooks/useUpdater2";
import {LOADING_TEXT_HARVEST, LOADING_TEXT_UPDATE} from "../PoolFarm";
import {LoadingFarm} from "../../LoadingFarm";

export const HarvestRewardsSuccess = ({
                                          pid,
                                          onClose
                                      }) => {
    const account = useSelector((state) => state.authUser.address);
    const userPoolList = useSelector((state) => state.authUser.userPoolList);

    // Fetching user data logic
    const [readyToClose, setReadyToClose] = useState(false);
    const [loadingUpdate, updater2] = useUpdater2(account);

    useEffect(() => {
        if (!loadingUpdate && readyToClose) {
            onClose();
            setReadyToClose(false);
        }
    }, [loadingUpdate, readyToClose]);

    const onOkay = () => {
        updater2();
        setReadyToClose(true);
    };

    return loadingUpdate ? (
        <LoadingFarm body={true ? LOADING_TEXT_UPDATE : LOADING_TEXT_HARVEST}/>
    ) : (
        <>
            <Flex justify="center">
                <HiCheckCircle size={70} color="#5FD9DD"/>
            </Flex>
            <Box mt={5}>
                <Text textAlign="center" fontSize={28}  mx={'-8px'} className="harvest-only-success-title" >
                    XFIT rewards successfully harvested!
                </Text>
            </Box>
            <Box bg="#262626" p={3} mt={5}  mx={'-20px'}>
                <Text textAlign="center" fontSize={18}>
                <span style={{fontSize: 36, color: "#FC307B"}}>
                  {userPoolList && formatDecimal(userPoolList[pid]["xfitEarned"], 0)}
                </span>{" "}XFIT
                </Text>
            </Box>
            <Box mt={20}>
                <StyledButton
                    onClick={onOkay}
                    style={{marginRight: 15}}
                >
                    Okay
                </StyledButton>
            </Box>
        </>
    );
};
