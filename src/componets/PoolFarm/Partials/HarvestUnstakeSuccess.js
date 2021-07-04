import {Flex, Box, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {HiCheckCircle} from "react-icons/hi";
import {useSelector} from "react-redux";
import {formatDecimal} from "../../../xfai/utils";
import useUpdater2 from "../../../hooks/useUpdater2";
import {LoadingFarm} from "../../LoadingFarm";
import {LOADING_TEXT_HARVEST, LOADING_TEXT_UPDATE} from "../PoolFarm";
import {StyledButton} from "../../Button";

export const HarvestUnstakeSuccess = ({
                                          pid,
                                          onClose,
                                          percent,
                                      }) => {
    const account = useSelector((state) => state.authUser.address);
    const poolList = useSelector((state) => state.authUser.poolList);
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
                <Text className="harvest-success-title" textAlign="center" fontSize={28}>
                    Everything successfully harvested and you have unstaked!
                </Text>
            </Box>
            <Box bg="#262626" p={4} mt={5}  mx={'-20px'}>
                <Text textAlign="center" fontSize={18}>
                  <span style={{fontSize: 36, color: "#FC307B"}}>
                    {userPoolList
                        ? formatDecimal(userPoolList[pid]["xfitEarned"], 0)
                        : 0}
                  </span>{" "}XFIT
                </Text>
            </Box>
            <Box bg="#262626" p={4} mt={3}  mx={'-20px'}>
                <Text textAlign="center" fontSize={18}>
            <span style={{fontSize: 36, color: "#FC307B"}}>
              $
                {formatDecimal(
                    userPoolList[pid].stakedLPAmount
                        .times(poolList[pid].lpPrice)
                        .times(percent)
                        .div(10000),
                    0
                )}
            </span>
                </Text>
            </Box>
            <Box px={5} mt={20}>
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
