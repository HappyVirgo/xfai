import React, { useRef, useState } from "react";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Portal,
  PopoverBody,
  PopoverHeader,
  PopoverCloseButton,
  PopoverArrow,
} from '@chakra-ui/react';


const TooltipWrapper = styled.div`
  
  margin-bottom: ${props => props.marginBottom || ''};
  cursor: pointer;
  vertical-align: top;  
  margin-left: 5px;
  display: inline-block;
  max-width: initial;
`;

function Tooltip({label, marginBottom, sid}) {

  return (
    <TooltipWrapper marginBottom={marginBottom} className="tt">
      <Popover
        bg='black'
        arrowSize={20}
        gutter={15}
        arrowShadowColor={'#262626'}
        size={360}
        preventOverflow
      >
        <PopoverTrigger>
          <span>
          <AiOutlineInfoCircle
            color="#5FD9DD"
            size={12}
          />
          </span>
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg='black'>
            <PopoverArrow bg="black"/>
            <PopoverCloseButton className="btn-close" />
            <PopoverBody>
              {label}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </TooltipWrapper>
  );
}

export default Tooltip;
