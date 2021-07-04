import React from "react";
import { Text, Flex, Box } from "@chakra-ui/react";
import styled from 'styled-components';

const StyledLoadingDiv = styled.div`
    background: transparent linear-gradient(270deg, #FC307B 0%, #a22dc9 50%,  #fc307b 100%) 0% 0% no-repeat padding-box;
    border-radius: 20px;
    height: 5px;
    width: 90%;
    margin: 0 5% 15%;
    background-position: 10px 0;
    background-size: 200% 100%;
    
    animation-name: color_change;
    animation-duration: 1.2s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
      
    @-webkit-keyframes color_change {
        0% {
          background-position: 0% 0;
        }
        50% {
          background-position: 100% 0;
        }
        100% {
          background-position: 0% 0;
        }
    }
    @-ms-keyframes color_change{
        0% {
          background-position: 0% 0;
        }
        50% {
          background-position: 100% 0;
        }
        100% {
          background-position: 0% 0;
        }
    }
    @-webkit-keyframes color_change{
        0% {
          background-position: 0% 0;
        }
        50% {
          background-position: 100% 0;
        }
        100% {
          background-position: 0% 0;
        }
    }
    @-o-keyframes color_change {
        0% {
          background-position: 0% 0;
        }
        50% {
          background-position: 100% 0;
        }
        100% {
          background-position: 0% 0;
        }
    }
    @keyframes color_change {
        0% {
          background-position: 0% 0;
        }
        50% {
          background-position: 100% 0;
        }
        100% {
          background-position: 0% 0;
        }
    }
`;

export const LoadingFarm = ({
                              body,
                              height,
                              wrapPros,
                            }) => {
  const bodyObj = body ? body : (
    <Text
      color="white"
      fontFamily="EuclidCircularA"
      fontSize={28}
      textAlign="center"
      marginTop={{base: 4}}
      marginBottom={{base: 4}}
    >
      Please wait while we complete your{" "}
      <span style={{color: "#5FD9DD"}}>Farming transaction</span>
    </Text>
  );

  return (
    <Flex minh={height || 485} h={'100%'} align="start" justify="center" direction="column">
      <Box px={5} {...wrapPros}>{bodyObj}</Box>
      <StyledLoadingDiv>
        {/*<Box mt={12} h={5}></Box>*/}
        {/*<ReactLoading type={"spokes"} color={"#fff"} height={5} marginTop={12}/>*/}
      </StyledLoadingDiv>
    </Flex>
  );
};
