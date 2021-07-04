import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Icon,
  Container,
  Spacer,
} from "@chakra-ui/react";
import { MdAddCircle, MdRemoveCircle } from "react-icons/md";
import styled from "styled-components";

import FaqDef from "./FaqDef";
import './index.css';
import Wallets from "../../componets/Wallets";

const ItemIconStyleProp = {
  color: '#5FD9DD',
  fontSize: {base: 20},
};

const ItemStyleProp = {
  ...ItemIconStyleProp,
  pl: {base: 5},
};


const Faq = () => {
  return (
    <Container px={{base: 4, md: 12}} maxW={{md: '100%'}}>
      <Flex justify="center">
        <Heading
          as="h1"
          textAlign="center"
          textTransform="uppercase"
          fontFamily="Gobold"
          fontWeight="normal"
          marginTop={{base: 0}}
          fontSize={{base: 45, md: 60}}
          mb={{base: 3}}
        >
          Crypto farming <span style={{color: "#FC307B"}}>FAQ</span>
        </Heading>
      </Flex>
      <Box pt={3}>
        <Text fontSize={16} textAlign={'center'}>
          New to crypto farming? Don’t worry, we’ve got you covered.
        </Text>
      </Box>

      <Flex flexDirection={{base: "column",sm: "column", md: "column", lg: "row"}}>
        <Box w={{base:'100%', lg: '55%'}}>
          <Box pt={{base: 10}}>
            <Text fontSize={26} fontWeight={600} textAlign={{base: 'left'}}>
              Frequently asked questions
            </Text>
          </Box>
          <Box pt={4}>
            <Accordion allowMultiple colorScheme='grey'>
              {FaqDef.map((faq, index) => (
                <AccordionItem
                  key={index}
                  __css={{borderColor: '#333'}}
                >
                  {({isExpanded}) => (
                    <div className={'acc-item' + (isExpanded? ' expanded' : '')}>
                      <h2 className="faq-title">
                        <AccordionButton
                          _active={{border: 0}}
                          _focus={{border: 0}}
                        >
                          {isExpanded ? (
                            <Icon as={MdRemoveCircle} {...ItemIconStyleProp}/>
                          ) : (
                            <Icon as={MdAddCircle} {...ItemIconStyleProp} />
                          )}
                          <Box flex="1" textAlign="left" {...ItemStyleProp}>
                            {faq.title}
                          </Box>
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4} pl={{base: '60px'}}>
                        {faq.paragraph}
                      </AccordionPanel>
                    </div>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Box>
        <Spacer />
        <Box w={{base:'100%', lg: '40%'}}>
          <Box pt={{base: 10}}>
            <Text fontSize={26} fontWeight={600} textAlign={{base: 'left'}}>
              Learn about & use crypto wallets
            </Text>
          </Box>
          <hr className="faq-sep"/>
          <Wallets/>
        </Box>
      </Flex>
    </Container>
  );
}

export default Faq;