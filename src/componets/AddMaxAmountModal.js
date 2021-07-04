import React from "react";
import {
  Text,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  Box,
  Button,
} from "@chakra-ui/react";
import { AiFillPlusCircle } from "react-icons/ai";

export const AddMaxAmountModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <HStack align="center" onClick={onOpen} cursor="pointer" className="tns-blue">
        <Text color="#5FD9DD" fontSize={13}  >
          Max
        </Text>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius={20} maxW={400}>
          <ModalBody
            bg="#1A1A1A"
            py={5}
            borderRadius={20}
            style={{ paddingTop: "30%" }}
          >
            <Box>
              <Text fontSize={28} textAlign="center">
                Add max amount?
              </Text>
            </Box>
            <Box bg="#262626" px={20} py={5} mt={6}>
              <Text color="#FC307B" fontSize={36} textAlign="center">
                10,000{" "}
                <span style={{ fontSize: 18, color: "white" }}>USDT</span>
              </Text>
            </Box>
            <div style={{ marginTop: "40%" }} />
            <HStack justify="center" spacing={10}>
              <Button
                className="btn"
                fontSize={22}
                w={160}
                h={53}
                onClick={onClose}
              >
                No
              </Button>
              <Button
                className="btn-alt"
                fontSize={22}
                w={160}
                h={53}
                onClick={onClose}
              >
                Yes
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
