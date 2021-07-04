import React, { Component } from 'react';
import { connect } from "react-redux";
import { setAddress, setNetworkId, setConnectType, setError, setInitData, setLoggedIn } from "./redux/actions";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { AppRouter } from "./router";
import { mode, createBreakpoints } from "@chakra-ui/theme-tools";

import { connector } from "./xfai/web3";
import { NotificationContainer } from 'react-notifications';
import { networkId } from './config';
import Web3 from 'web3';

import "./App.css";
import 'react-notifications/lib/notifications.css';

import AOS from "aos";
import "aos/dist/aos.css";
import { MSG_SELECT_KOVAN_NET, MSG_SELECT_MAIN_NET } from "./xfai/lang";
import { isLoggedIn } from "./xfai/AuthUtil";

AOS.init();

const breakpoints = createBreakpoints({
  /*sm: "360px",
  md: "768px",
  lg: "960px",
  xl: "1200px",*/
  xs: "22.5em",
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
});


const theme = extendTheme({
  breakpoints,
  styles: {
    global: (props) => ({
      body: {
        fontFamily: "EuclidCircularA",
        color: "#FFFFFF",
        bg: mode("black", "black")(props),
        lineHeight: "base",
      },
    }),
  },
  popper: {
    arrow: {
      bg: '#000000'
    }
  },
  sizes: {
    xs: '360px'
  }
});


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      netId: null,
    }

    if (connector.connected) {
      this.props.setAddressRequest(connector._accounts[0]);
      this.props.setNetworkIdRequest(connector._chainId.toString(10));
      this.props.setConnectTypeRequest('walletConnect');
    } else {
      window.web3 = null;

      // modern broswers
      if (typeof window.ethereum !== "undefined") {
        window.web3 = new Web3(window.ethereum);
        window.web3.eth.net.getId((err, netId) => {
          this.handleNetworkChanged(`${netId}`);
          window.ethereum.request({method: 'eth_accounts'}).then(accounts => {
            if (accounts[0]) {
              this.props.setAddressRequest(accounts[0]);
            }
          });
          window.ethereum.on("accountsChanged", (accounts) =>
            this.handleAddressChanged(accounts)
          );
          window.ethereum.on("networkChanged", (networkId) =>
            this.handleNetworkChanged(networkId)
          );
          this.props.setConnectTypeRequest('metamask');
        });
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.web3 = null;
      }
    }
  }

  handleAddressChanged(accounts) {
    const {netId} = this.state;

    if (typeof window.ethereum !== "undefined") {
      if (accounts[0]) {
        this.props.setAddressRequest(accounts[0]);
        this.props.setLoggedIn(isLoggedIn(netId, accounts[0]));
      } else {
        this.props.setAddressRequest(null);
        this.props.setNetworkIdRequest(null);
        this.props.setConnectTypeRequest('');
        this.props.setInitData();
      }
    }
  };

  handleNetworkChanged(netId) {
    this.props.setNetworkIdRequest(netId);
    this.setState({netId})
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.netId !== this.state.netId) {
      switch (this.state.netId) {
        case "1":
          if (networkId === "1") {
            this.props.setErrorRequest(false);
          } else {
            if (this.state.netId && prevState.netId)
              this.props.setErrorRequest(MSG_SELECT_MAIN_NET);
            this.props.setInitData();
          }
          break;
        case "42":
          if (networkId === "42") {
            this.props.setErrorRequest(false);
          } else {
            if (this.state.netId && prevState.netId)
              this.props.setErrorRequest(MSG_SELECT_KOVAN_NET);
            this.props.setInitData();
          }
          break;
        default:
          if (this.state.netId && prevState.netId)
            this.props.setErrorRequest(networkId === "42" ? MSG_SELECT_KOVAN_NET : MSG_SELECT_MAIN_NET);
          this.props.setInitData();
      }

    }
  }

  render() {
    return (
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode="dark"/>
        <AppRouter/>
        <NotificationContainer/>
      </ChakraProvider>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAddressRequest: (address) => dispatch(setAddress(address)),
    setNetworkIdRequest: (networkId) => dispatch(setNetworkId(networkId)),
    setConnectTypeRequest: (connectType) => dispatch(setConnectType(connectType)),
    setErrorRequest: (error) => dispatch(setError(error)),
    setInitData: () => dispatch(setInitData()),
    setLoggedIn: (status) => dispatch(setLoggedIn(status)),
  };
};

export default connect(null, mapDispatchToProps)(App);
