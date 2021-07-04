import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import {
    Flex,
    Box,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from "@chakra-ui/react";
import {bnMultipledByDecimals, formatDecimal, nf} from "../../../xfai/utils";
import {StyledButton} from "../../../componets/Button";
import {getXfaiContract} from "../../../xfai/contracts";
import {LoadingFarm} from "../../../componets/LoadingFarm";
import {LOADING_TEXT_UNSTAKE} from "../PoolFarm";


export const HarvestUnstake = ({
                                   pid,
                                   onClose,
                                   onCloseHarvest, // Success callback.
                               }) => {
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    const [sliderVal, setSliderVal] = useState(10000);
    const onSliderChange = (value) => {
        setSliderVal(value);
    };

    const account = useSelector((state) => state.authUser.address);
    const poolList = useSelector((state) => state.authUser.poolList);
    const userPoolList = useSelector((state) => state.authUser.userPoolList);

    const onNo = () => {
        onClose();
    };

    const onYes = () => {
        const xfaiContract = getXfaiContract();

        setWithdrawLoading(true);
        xfaiContract.methods
            .withdrawLPWithToken(
                pid,
                `0x${bnMultipledByDecimals(userPoolList[pid]["stakedLPAmount"])
                    .times(sliderVal)
                    .div(10000)
                    .dp(0)
                    .toString(16)}`
            )
            .send({from: account})
            .on("transactionHash", (hash) => {
                console.log("hash :>> ", hash);
                // NotificationManager.info("Transaction Submitted!");
            })
            .on("receipt", (receipt) => {
                // NotificationManager.success("Unstake Success!");
                // history.push(`/harvest/${pid}/${sliderVal}/unstake/success`);
                onCloseHarvest(sliderVal);
            })
            .on("error", (err, receipt) => {
                setWithdrawLoading(false);
                // NotificationManager.error("Unstake Denied!");
            });
    };

    const formatAmount = () => {
        // return Intl.NumberFormat().format(sliderVal);
        return (
            userPoolList && nf(
                userPoolList[pid].stakedLPAmount
                    .times(poolList[pid].lpPrice)
                    .times(sliderVal)
                    .div(10000),
                0
            )
        );
    };
    return (
        <>
            {withdrawLoading ? (
                <LoadingFarm body={LOADING_TEXT_UNSTAKE}/>
            ) : (
                <>
                    <Box>
                        <Text
                            fontSize={24}
                            textAlign="center"
                            style={{paddingTop: "5%"}}
                            mx={'-20px'}
                        >
                            Harvest XFIT & unstake?
                        </Text>
                    </Box>
                    <Box bg="#262626" p={3} mt={5} mx={'-20px'}>
                        <Text textAlign="center" fontSize={18}>
                            <span style={{fontSize: 36, color: "#FC307B"}}>
                              {userPoolList
                                  ? formatDecimal(userPoolList[pid]["xfitEarned"], 0)
                                  : 0}
                            </span>{" "} XFIT
                        </Text>
                    </Box>
                    <Box bg="#262626" p={3} mt={3}  mx={'-20px'}>
                        <Text textAlign="center" fontSize={18}>
                            <span style={{fontSize: 36, color: "#FC307B"}}>
                              ${formatAmount()}&nbsp;*
                            </span>
                        </Text>
                        <Box mx={1} mt={2}>
                            <Slider
                                aria-label="slider"
                                defaultValue={30}
                                colorScheme="#262626"
                                min={0}
                                max={10000}
                                onChange={onSliderChange}
                                value={sliderVal}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack/>
                                </SliderTrack>
                                <SliderThumb className="slider-thumb" w={27} h={27}/>
                            </Slider>
                        </Box>
                    </Box>
                    <Box pt={3}>
                        <Text align="center" fontSize={14}>
                            * The amount you unstake will be half in dollars and half in
                            XFIT tokens.
                        </Text>
                    </Box>
                    <Flex align="center" justify="space-between" pt={50} px={5}>
                        <StyledButton
                            onClick={onNo}
                            className="blue"
                            style={{marginRight: 15}}
                        >
                            No
                        </StyledButton>
                        <StyledButton
                            onClick={onYes}
                            className={`${withdrawLoading ? "disabled" : ""}`}
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
