import React from 'react';
import styled from "styled-components";

export function StyledButton({width, height, className, style, onClick, children}){
  const mergedProps = {
    width,
    height,
    style,
    className: `sb${(className)? ` ${className}` : ``}`,
    onClick,
  };
  return <StyledButtonInner {...mergedProps}>{children}</StyledButtonInner>;
}

export const StyledButtonInner = styled.div`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 53}px;
  background: linear-gradient(104deg, #a22dc9  0%, #a22dc9 100%); 
  transition: opacity .5s ease-in-out; 
  opacity: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity .5s ease-in-out;
  font-weight: 600;
  position: relative;
  z-index: 0;
  
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;    
    background: linear-gradient(104deg, #fc307b  0%, #a22dc9 100%);
    transition: opacity .5s ease-in-out; 
    border-radius: 10px;
    z-index:-2; 
  }
  
  &.blue {
    background-image: linear-gradient(104deg, #2c92ef 0%, #2c92ef 100%);
    transition: opacity .5s ease-in-out; 
  }
  &.blue::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      transition: opacity .5s ease-in-out; 
      border-radius: 10px;
      z-index:-2; 
      opacity:1;
     
  }
  &.blue::before {
    background-image: linear-gradient(104deg, #5fd9dd 0%, #2c92ef 100%);
    transition: opacity .5s ease-in-out;
  }
  &.blue:hover::before, &:hover::before {
    opacity: 0;
  }
  
  
  &.grey, &.grey:hover {
    background: #262626 0% 0% no-repeat padding-box;
  }
  &.grey::before{
    opacity: 0;
  }
  &.grey:hover{
    background-position: right center;
    background-size: 300%;
  }
  `;
  // &.disabled, &.disabled:hover {
  //   pointer-events: none;
  //   background: #262626 0% 0% no-repeat padding-box;
  //   color: #4d4d4d;
  // }
  // &.disabled::before{
  //   opacity: 0;
  // }
  