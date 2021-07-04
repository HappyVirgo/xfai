import React from 'react';
import metamask from "../../assets/images/metamask.svg";
import walletconnect from "../../assets/images/walletconnect.svg";
import portis from "../../assets/images/portis.png";
import coinbase from "../../assets/images/coinbase2.png";
import fortmatic from "../../assets/images/fortmatic.jpg";

const WalletDef = [
  {
    name: 'MetaMask',
    url: 'https://metamask.io/',
    src: metamask,
  },
  {
    name: 'WalletConnect',
    url: 'https://walletconnect.org/',
    src: walletconnect,
  },

  {
    name: 'Portis',
    url: 'https://www.portis.io/',
    src: portis,
  },

  {
    name: 'Coinbase Wallet',
    url: 'https://wallet.coinbase.com/',
    src: coinbase,
  },

  {
    name: 'Fortmatic',
    url: 'https://fortmatic.com/',
    src: fortmatic,
  },
];
export default WalletDef;