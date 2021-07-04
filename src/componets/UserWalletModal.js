import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  VStack,
  Icon,
  useBreakpointValue,

} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector, useDispatch } from "react-redux";
import { StyledButton } from "./Button";

import styled from 'styled-components';
import { setAddress, setConnectType, setLoggedIn, setNetworkId } from "../redux/auth/actions";
import { ModalOverlayProps } from "./LoadingPoolData";
import { doLogout, isLoggedIn } from "../xfai/AuthUtil";
import { networkId } from "../config";

const StyledIconWrap = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  & > span{
    margin-left: 7px;
  }
`;

export const UserWalletModal = ({
                                  isOpen,
                                  onClose,
                                }) => {
  const [copied, setCopied] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const dispatch = useDispatch();
  const address = useSelector((state) => state.authUser.address);
  const curNetworkId = useSelector((state) => state.authUser.networkId);
  const modalSize = useBreakpointValue({base: "full", md: "md"});

  const onLogout = async () => {
    doLogout(curNetworkId, address, 'metamask');
    dispatch(setAddress(null));
    dispatch(setNetworkId(curNetworkId));
    dispatch(setConnectType(null));
    setLoggedOut(true);
    dispatch(setLoggedIn(false));
  };

  const loggedIn = isLoggedIn(curNetworkId, address);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize} autoFocus={false}>
        <ModalOverlay {...ModalOverlayProps} />
        <ModalContent
          bg="#000000"
          borderRadius={20}
          borderWidth={2}
          borderStyle="solid"
          borderColor="#262626"
          top={{base: 10}}
          minH='initial'
        >
          <ModalCloseButton size="lg"/>
          <ModalBody py={67} pb={5}>
            {(address && loggedIn) && <VStack spacing={30} align="stretch">
              <Text textAlign="center" fontSize={27} mb={6}>
                Your wallet
              </Text>

              <Box
                py={4}
                px={8}
                bg={'#1A1A1A 0% 0% no-repeat padding-box;'}
                borderRadius={10}
              >
                <Text fontSize={14} textAlign={'center'}>{copied ? <StyledIconWrap><Icon as={MdCheckCircle} boxSize="6" color='#5FD9DD'/> <span>Copied</span></StyledIconWrap> : address}</Text>
              </Box>
              <Box>
                <CopyToClipboard onCopy={() => setCopied(true)} text={address}>
                  <StyledButton className={"blue"} height={53}>Copy address</StyledButton>
                </CopyToClipboard>
              </Box>
              {<Box>
                <StyledButton height={53} onClick={onLogout}>Logout</StyledButton>
              </Box>}
            </VStack>}

            {loggedOut && <VStack spacing={30} align="stretch">
              <Box textAlign={"center"}>
                <div>
                  <Icon as={MdCheckCircle} boxSize="14" color='#5FD9DD'/>
                </div>
                <Text textAlign="center" fontSize={28} mb={6} my={6} style={{display: 'inline-block', width: 165}}>
                  Successfully logged out
                </Text>
              </Box>
              <Box>
                <StyledButton height={53}
                              onClick={e => {
                                setLoggedOut(false);
                                onClose();
                              }}>Okay</StyledButton>
              </Box>
            </VStack>}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
