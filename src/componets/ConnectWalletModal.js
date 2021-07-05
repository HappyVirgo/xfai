import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Box,
  Checkbox,
  HStack,
  Link,
  Image,
  useBreakpointValue, Icon,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { networkId } from '../config';
// import metamask from "../assets/images/metamask.svg";
import metamaskAlt from "../assets/images/metamask-logo.jpg";
import metamaskAltDisabled from "../assets/images/metamask-logo-disabled.jpg";
import { NotificationManager } from "react-notifications";
import { setAddress, setNetworkId, setConnectType, setLoggedIn } from "../redux/actions";
import { StyledButton } from "./Button";
import { UserWalletModal } from "./UserWalletModal";
import { MdCheckCircle } from "react-icons/md";
import { getLocalData, LS_KEY_TOS, setLocalData } from "../xfai/utils";
import TermsOfServiceModal from "./TermsOfServiceModal";
import styled from 'styled-components';

import { ModalOverlayProps } from "./LoadingPoolData";
import { MSG_CONNECT_REQUIRED_DESKTOP, MSG_CONNECT_REQUIRED_MOBILE, MSG_CONNECT_WALLET, MSG_SELECT_KOVAN_NET, MSG_SELECT_MAIN_NET } from "../xfai/lang";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import { doLogin, isLoggedIn } from "../xfai/AuthUtil";

const StyledGreenDotSpan = styled.span`
  width: 9px;
  height: 9px;
  background: #4EBE68 0% 0% no-repeat padding-box;
  border: 1px solid #727272;
  opacity: 1;
  border-radius: 7px;
  margin-bottom: 10px;
  margin-left: 3px;
`;

const StyledDivWrap = styled.div`
  .wallet-row {
    background: #1A1A1A;
    color: #FC307B;
    border-color: #1A1A1A;    
    -webkit-transition: all 0.3s ease-in-out 0s;
    -o-transition: all 0.3s ease-in-out 0s;
    transition: all 0.3s ease-in-out 0s;
    
    &:hover{
      color: #f94084;
      background: #1B1B1B;
      border-color: #FC307B;
    }
    &.disabled{
      color: #444444;
      cursor: not-allowed;
    }
    &.disabled:hover {
      background: #1A1A1A;
      border-color: #1A1A1A;
      -webkit-transition: none;
      -o-transition: none;
      transition: none;
    }
    &.error{
      color: #ff0000;
      border-color: #FC0000;
    }
    &.error:hover{
      -webkit-transition: none;
      -o-transition: none;
      transition: none;
    }
    &.disabled .wallet-img-wrap{
      position: relative;
    }
    &.disabled .wallet-img-wrap:after{
      /*top: 0;
      left: 0;
      position: absolute;
      content: ' ';
      width: 46px;
      height: 46px;
      border-radius: 30px;
      background: #1A1A1A;
      opacity: 0.5;*/
    }
  }
  .wallet-error {
    color: #ff0000;
    margin-top: 10px;
  }
  .tos-chk {
    & > span{
      border: none;
      background: #444444;
    }
    &:hover > span, &:focus > span, &:active > span{
      background: #373737;
      box-shadow: none !important;
    }
  }
`;


const wallets = ["MetaMask"];

export const ConnectWalletModal = ({
                                     isBody = false,
                                     onCloseHamburger
                                   }) => {
  const [isToSChecked, setIsToSChecked] = useState(getLocalData(LS_KEY_TOS));
  const [errorMsg, setErrorMsg] = useState();

  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclosure();

  const {
    isOpen: isOpenWallet,
    onOpen: onOpenWallet,
    onClose: onCloseWallet,
  } = useDisclosure();

  const {
    isOpen: isOpenTos,
    onOpen: onOpenTos,
    onClose: onCloseTos,
  } = useDisclosure();

  const dispatch = useDispatch();
  const address = useSelector((state) => state.authUser.address);
  const curNetworkId = useSelector((state) => state.authUser.networkId);
  const loggedIn = useSelector((state) => state.authUser.loggedIn);

  useEffect(() => {
    validateNetwork();
    if (isLoggedIn(curNetworkId, address))
      dispatch(setLoggedIn(true));
  }, [address, curNetworkId]);

  useEffect(() => {
    setIsToSChecked(getLocalData(LS_KEY_TOS));
  }, [isOpen, isOpenTos]);

  const validateNetwork = async () => {
    // We show the errors below a wallet horizontal box.
    // const isNetworkIdValid = curNetworkId && curNetworkId == networkId;
    const netId = `${await window.web3?.eth?.net.getId()}`;
    if (netId === 'undefined') {
      setErrorMsg(isMobile ? MSG_CONNECT_REQUIRED_MOBILE : MSG_CONNECT_REQUIRED_DESKTOP);
    } else {
      if (netId != networkId) {
        if (networkId == "1")
          setErrorMsg(MSG_CONNECT_WALLET);
        else if (networkId == "42") {
          setErrorMsg(MSG_SELECT_KOVAN_NET);
        }
      } else
        setErrorMsg('');
    }
  }


  const onChangeAgree = (e) => {
    if (e.target.checked) {
      setLocalData(LS_KEY_TOS, 1);
    } else {
      setLocalData(LS_KEY_TOS, null);
    }
    setIsToSChecked(e.target.checked);
  };

  const handleConnectWallet = e => {
    onCloseHamburger && onCloseHamburger();
    const isTermsAgreed = getLocalData(LS_KEY_TOS);
    if (isTermsAgreed) onOpen();
    else onOpenTos();
  }

  const handleOpenWallet = e => {
    onCloseHamburger && onCloseHamburger();
    if (address) onOpenWallet();
    else {
      if (getLocalData(LS_KEY_TOS)) onOpen();
      else onOpenTos();
    }
  }

  const onMetamaskConnect = async () => {
    // checking if ToS is checked.
    const tos = getLocalData(LS_KEY_TOS);
    if (!tos) return;

    validateNetwork();

    const netId = `${await window?.web3?.eth.net.getId()}`
    const isNetworkIdValid = netId && netId == networkId;
    if (!isNetworkIdValid) return;

    if (typeof window.ethereum === "undefined") {
      setErrorMsg(MSG_CONNECT_REQUIRED_DESKTOP);
      // NotificationManager.warning("Please install MetaMask!");
      return;
    }

    try {
      if (netId !== networkId) {
        if (networkId === "1")
          setErrorMsg(MSG_CONNECT_WALLET);
        else if (networkId === "42")
          setErrorMsg(MSG_SELECT_KOVAN_NET);
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0]) {
        setErrorMsg(null);
        dispatch(setNetworkId(netId));
        dispatch(setAddress(accounts[0]));
        dispatch(setConnectType("metamask"));
        doLogin(netId, accounts[0], 'metamask');
        dispatch(setLoggedIn(true));
      }
    } catch (error) {
      // NotificationManager.warning('Something went wrong while connect wallet');
      // setErrorMsg('Something went wrong while connect wallet. Please try again.');
      console.log(error);
    }
    onClose();
  };

  const modalSize = useBreakpointValue({base: "full", md: "md"});
  const modalSizeConnect = {base: "360px", md: "360px"};

  return (
    <>
      {(address && loggedIn) ? (
        <StyledButton onClick={handleOpenWallet} className="menu-item-wallet">
          <span className="desc">Your wallet: </span>
          {`${address.slice(0, 4)}...${address.slice(-4)}`}
          <StyledGreenDotSpan></StyledGreenDotSpan>
        </StyledButton>
      ) : (
        <StyledButton onClick={handleConnectWallet} style={{width: isBody ? '100%' : 170}} className="menu-item-wallet">
          Connect Wallet
        </StyledButton>
      )}

      {((!address || !loggedIn) && isOpen) && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'xs'}
        autoFocus={false}
        isCentered
      >
        <ModalOverlay {...ModalOverlayProps}/>
        <ModalContent
          bg="#000000"
          borderRadius={20}
          borderWidth={2}
          borderStyle="solid"
          borderColor="#262626"
        >
          <ModalCloseButton size="lg"/>
          <ModalBody pt={16} py={5}>
            <StyledDivWrap>
              <Text textAlign="center" fontSize={27}>
                Connect to a wallet
              </Text>
              <HStack spacing={3} justify="" align="start" mt={5}>
                <Checkbox
                  colorScheme="gray"
                  bgColor="#444444"
                  iconColor="#fff"
                  size="lg"
                  defaultIsChecked
                  mt={1}
                  onChange={onChangeAgree}
                  checked={isToSChecked}
                  className="tos-chk"
                />
                <Box>
                  <Text fontSize={14} textAlign="left">
                    I have read, understand, and agree to the
                  </Text>
                  <Text color="#5FD9DD" fontSize={14} mt={-1} display="block" onClick={onOpenTos} cursor='pointer'>
                    Terms of Service.
                  </Text>
                </Box>
              </HStack>
              {wallets.map((wallet) => (
                <div key={wallet}>
                  <HStack
                    cursor="pointer"
                    key={wallet}
                    p={3}
                    mt={3}
                    borderRadius={10}
                    justify="space-between"
                    borderWidth={2}
                    borderColor="transparent"
                    onClick={onMetamaskConnect}
                    className={`wallet-row${isToSChecked ? (errorMsg ? ' error' : '') : ' disabled'}`}
                  >
                    <Text fontSize={21} className="wallet-name">
                      {wallet}
                    </Text>
                    <Box bg="white" p={2} borderRadius={30} className="wallet-img-wrap">
                      <Image src={metamaskAlt} alt="" w={30} h={30} style={{display: isToSChecked ? 'inline-block' : 'none'}}/>
                      <Image src={metamaskAltDisabled} alt="" w={30} h={30} style={{display: isToSChecked ? 'none' : 'inline-block'}}/>
                    </Box>
                  </HStack>
                  {(errorMsg) && <Text fontSize={14} className="wallet-error">
                    {errorMsg}
                  </Text>}
                </div>
              ))}
            </StyledDivWrap>
          </ModalBody>
        </ModalContent>
      </Modal>}

      {isOpenWallet && <UserWalletModal
        isOpen={isOpenWallet}
        onClose={onCloseWallet}
      />}

      {isOpenTos && <TermsOfServiceModal
        isOpen={isOpenTos}
        onClose={onCloseTos}
        onAfterClose={onOpen}
      />}
    </>
  );
};
