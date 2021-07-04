import React, { useEffect, useState } from "react";
import { Text, Flex, Box, useBreakpointValue, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Modal } from "@chakra-ui/react";
import ReactLoading from "react-loading";
import styled from 'styled-components';
import { ModalContentProps } from "./CommonStyles";
import { LoadingFarm } from "./LoadingFarm";

const StyledLoadingDiv = styled.div`

`;

export const ModalOverlayProps = {
  background: 'rgb(0,0,0,0.9)'
}
const ModalPros = {
  ...ModalContentProps,
  marginTop: {base: 0},
  marginBottom: {base: 0},
  h: '100vh',
  className: 'dlg-loading'
};

export const ErrorMessageModal = ({
                                  loading,
                                  message,
                                }) => {
  const modalSize = useBreakpointValue({base: 'full'});

  const [isOpen, setIsOpen] = useState(loading);

  useEffect(() => {
    setIsOpen(loading);
  }, [loading]);

  const body = (
    <Flex textAlign="center" style={{maxWidth: '526px', margin: '0 auto', height: '100%'}} alignItems="center">
      <Text
        color="white"
        fontFamily="EuclidCircularA"
        fontSize={32}
        textAlign="center"
      >
        In your digital wallet, please select <span style={{color: '#FC307B'}}>Ethereum Mainet</span> in order to farm
      </Text>
    </Flex>
  );

  // to do: Remove test code
  return (
    <StyledLoadingDiv>
      <Modal
        isOpen={isOpen}
        onClose={() => {
        }}
        size={modalSize}
        autoFocus={false}
        isCentered
      >
        <ModalOverlay bg="#000000E8" className={`${ModalPros.className}-overlay`}/>
        <ModalContent
          {...ModalPros}
        >
          <ModalBody px={0} borderRadius={10}>
            {body}
          </ModalBody>
        </ModalContent>
      </Modal>
    </StyledLoadingDiv>
  );
};
