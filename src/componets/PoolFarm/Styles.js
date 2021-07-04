import React from "react";
import styled from "styled-components";

const StyledTitle = styled.span`
  background: -webkit-linear-gradient(0deg, #5fd9dd, #2c92ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledAmountWrap = styled.div`
  margin-bottom: 26px;  
`;

const StyledInput = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background: #262626 0% 0% no-repeat padding-box;
  border-radius: 10px;
  padding: 15px;
  width: 100%;
  margin-top: 10px;
  border: 1px solid #262626;

  input {
    width: 70%;
    border: none;
    height: 100%;
    font-size: 16px;
    color: white;
    text-align: left;
    background: transparent;
    &:focus {
      outline: none;
    }
    &::-webkit-input-placeholder {
      color: #4d4d4d;
    }
  }
  .max {
    position: absolute;
    right: 25px;
    width: 70px;
    text-align: right;
    font-weight: 400;
    font-size: 14px;
    color: #4d4d4d;
  }
  .max.hide{
    display: none;
  }
  input::placeholder{
    color: #4D4D4D;
  }
  
  /** Input box **/
  &.error {
    border-color: #FF0000;
    -webkit-transition: all 0.3s ease-in-out 0s;
    -o-transition: all 0.3s ease-in-out 0s;
    transition: all 0.3s ease-in-out 0s;
  }
`;

const StyledInputHelpDiv = styled.div`
  text-align: left;	
  color: #ff0000;   
  font-size: 14px;
  margin-top: 7px;
  -webkit-transition: all 0.3s ease-in-out 0s;
  -o-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;  
`;

export {StyledInput,StyledAmountWrap, StyledTitle, StyledInputHelpDiv};
