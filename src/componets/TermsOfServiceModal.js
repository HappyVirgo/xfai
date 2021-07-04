import React, { useEffect, useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Box,
  VStack,
  Icon,
  useBreakpointValue,
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/react";

import { StyledButton } from "./Button";
import { LS_KEY_TOS, setLocalData } from "../xfai/utils";
import { ModalContentProps } from "./CommonStyles";

const TitleBoxProps = {
  color: "#5FD9DD",
  fontSize: 18,
  pb: '10px',
  mb: '10px',
  borderBottom: '1px solid #333',
};

const ContentBoxProps = {
  fontSize: 14,
  mb: 5
};

const imgIndexes = new Array(93);
for (let i = 0; i < 93; i++) {
  imgIndexes[i] = `/terms-of-services/XFitTokenTermsAndConditions-TermsOfUse-${i + 1}.png`;
}

// const width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;

const ModalContentPropsToS = {
  ...ModalContentProps,
  // borderWidth: width <= 360 ? 0 : 2,
  className: 'dlg-tos',
};
const TermsOfServiceModal = ({
                               isOpen,
                               onClose,
                               onAfterClose
                             }) => {

  const modalSize = useBreakpointValue({base: "xs"});

  const onAgree = () => {
    setLocalData(LS_KEY_TOS, 1);
    onClose();
    onAfterClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={modalSize}
        autoFocus={false}
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay bg="#000000E5"/>
        <ModalContent
          {...ModalContentPropsToS}
        >
          <ModalHeader mt={10} px={0}>
            <Text textAlign="center" fontSize={27} fontWeight={400}>
              Terms of Service
            </Text>
          </ModalHeader>
          <ModalCloseButton size="lg"/>
          <div className="wrap-modal-body">
            <ModalBody px={0} borderRadius={10} className="modal-body">
              <Box
                px={2.5}
                bg={'#1A1A1A 0% 0% no-repeat padding-box;'}
                borderRadius={10}
              >
                {imgIndexes.map((src) => (
                  <LazyLoadImage
                    key={src}
                    alt={'Terms of service'}
                    effect="blur"
                    src={src}/>
                ))}
              </Box>
            </ModalBody>
          </div>
          <ModalFooter px={0} style={{textAlign: 'center'}}>
            <StyledButton height={40} onClick={onAgree} className="blue" width={''}>I agree</StyledButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TermsOfServiceModal;