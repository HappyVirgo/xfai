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
  h: '100vh',
  className: 'dlg-loading'
};

export const LoadingPoolData = ({
                                  loading,
                                  message,
                                }) => {
  const modalSize = useBreakpointValue({base: "xs"});

  const [isOpen, setIsOpen] = useState(loading);

  useEffect(() => {
    setIsOpen(loading);
  }, [loading]);

  const body = (
    <Box textAlign="center" style={{width: '100%'}}>
      <Text
        color="white"
        fontFamily="EuclidCircularA"
        fontSize={28}
        textAlign="center"
        marginTop={{base: 4}}
        marginBottom={{base: 4}}
      >
        {message || "Loading pools"}
      </Text>
    </Box>
  );

  // todo: Remove test code
  return (
    <StyledLoadingDiv>
      <Modal
        isOpen={false && isOpen}
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
            <LoadingFarm body={body} height={300} wrapPros={{w: '100%'}}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </StyledLoadingDiv>
  );
};
