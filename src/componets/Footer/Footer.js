import React from 'react';
import { Box, VStack, Text, HStack, Flex, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Modal, useBreakpointValue, } from "@chakra-ui/react";
import { LinksUrls, NavIcons } from "../Header/Header";

import './index.css';
import { ModalContentProps, ModalContentPropsToc } from "../CommonStyles";
import { StyledButton } from "../Button";
import { ModalOverlayProps } from "../LoadingPoolData";

const NavFooterExcludes = ['Whitepaper', 'FAQ1', 'FAQ2', 'lqd'];

const ModalTerms = {
  ...ModalContentProps,
  className: 'dlg-terms',
  marginTop: {base: '0px'},
  marginBottom: {base: '0px'},
  h: {base: '100vh'},
  m: {base: '0px'},
  maxH: {base: '100vh', sm: '100vh', xl: '100vh',}
};

export default function Footer() {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclosure();

  const modalSize = useBreakpointValue({base: "full"});

  return (
    <Box className="container-wrap footer-wrap">
      <Box className="footer">
        <VStack>
          <Flex flexWrap="wrap" className="f-wrap">
            <Flex className="f-items">
              <NavIcons iconOnly excludes={NavFooterExcludes} links={LinksUrls}/>
            </Flex>
            <Box
              borderRightWidth={1}
              borderRightColor="gray.700"
              h={5}
              w={1}
              display={{base: "none", md: "unset"}}
              className="sep"
            />
            <Box className="cp-text">
              <Text fontSize={17} style={{fontWeight: 400}}>© {new Date().getFullYear()} XFAI</Text>
            </Box>
          </Flex>

          <HStack spacing={7} className="f-wrap-sm">
            <NavIcons iconOnly excludes={NavFooterExcludes} links={LinksUrls}/>
            <Box
              borderRightWidth={1}
              borderRightColor="#333"
              h={5}
              w={1}
              className="sep"
            />
            <Box className="cp-text">
              <Text fontSize={17} style={{fontWeight: 400}}>© {new Date().getFullYear()} XFAI</Text>
            </Box>
          </HStack>
        </VStack>


        <VStack pt={6}>
          <HStack spacing={4} fontSize={13} flexWrap="wrap" className="cr-wrap">
            <Box>
              <Text>Contracts audited by <a href={'https://omniscia.io'} target="_blank" style={{fontSize: 13, color: "#5FD9DD"}}>omniscia.io</a></Text>
            </Box>
            <Box
              borderRightWidth={1}
              borderRightColor="#333333"
              h={3}
              w={1}
              style={{marginLeft: '12px'}}
              className="sep"
            />
            <Box style={{marginLeft: '12px'}}>
              <Text fontSize={13}><span onClick={onOpen} style={{fontSize: 13, color: "#5FD9DD", cursor: 'pointer'}}>Terms and Conditions </span></Text>
            </Box>
          </HStack>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={modalSize}
            autoFocus={false}
          >
            <ModalOverlay {...ModalOverlayProps}/>
            <ModalContent
              {...ModalTerms}
            >
              <ModalHeader __css={{minHeight: 50}}></ModalHeader>
              <ModalCloseButton size="lg"/>
              <ModalBody px={0} borderRadius={10}>
                <iframe className="lity-iframe-container" src="https://xfai.netlify.app/tos.html">
                </iframe>
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </Box>
    </Box>
  )
}
