import React, { useEffect } from "react";
import { Box, HStack, Image, Text } from "@chakra-ui/react";
import metamask from "../assets/images/metamask.svg";
import WalletDef from "../pages/Faq/WalletDef";

const Wallets = () => {
  return (
    <Box>
      {WalletDef.map((wallet) => (
        <a href={wallet.url} target={"_blank"}>
          <HStack
            cursor="pointer"
            key={wallet.name}
            bg="#1A1A1A"
            p={2}
            mt={3}
            borderRadius={10}
            justify="space-between"
            borderWidth={2}
            borderColor="transparent"
            _active={{borderColor: "#4aa9ac"}}
            _hover={{borderColor: "#4aa9ac"}}
            minW={260}
          >
            <Text color="#5FD9DD" fontSize={21}>
              {wallet.name}
            </Text>
            <Box bg="white" p={2} borderRadius={30}>
              <Image src={wallet.src} alt={wallet.name} w={30} h={30}/>
            </Box>
          </HStack>
        </a>
      ))}
    </Box>
  );
}

export default Wallets;