import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  Image,
  Stack,
  Container,
  CloseButton,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { useHistory, useLocation, useParams } from "react-router-dom";
import telegram from "../../assets/images/telegram.svg";
import github from "../../assets/images/FooterIcon-Github.svg";
import medium from "../../assets/images/iconmonstr-medium-1.svg";
import linkedin from "../../assets/images/iconmonstr-linkedin-3.svg";
import email from "../../assets/images/FooterIcon-Mail.svg";
import twitter from "../../assets/images/FooterIcon-Twitter.svg";
import _ from 'lodash';
import { NotificationManager } from "react-notifications";

import logo from "../../assets/images/XFAI-Logo.svg";
import { ConnectWalletModal } from "../ConnectWalletModal";
import {
  setCurrentAPY,
  setPoolList,
  setUserPoolList,
  setUserTotalInfo,
  setStartBlock, setCurrentAPR, setInitData, setError,
} from "../../redux/actions";
import { useDispatch } from "react-redux";
import { StyledButton } from "../Button";
import {
  formatDecimal,
  nf,
  updatePoolInfo,
} from "../../xfai/utils";
import { useSelector } from "react-redux";
import { getXfaiContract } from "../../xfai/contracts";
import "./index.css";

import topBorderBg from "../../assets/images/topborder.png";
import Tooltip from "../Tooltip";
import { LoadingPoolData } from "../LoadingPoolData";
import { networkId } from "../../config";
import { isLoggedIn } from "../../xfai/AuthUtil";
import { ErrorMessageModal } from "../ErrorMessageModal";

export const LinksUrls = [
  {
    name: 'Whitepaper',
    url: 'https://xfai.com/whitepaper.html',
    external: true,
  },
  {
    name: 'lqd',
    url: 'https://xfai.com/LGE.html',
    external: true,
    title: 'Liquidity Generation Event'
  },
  {
    name: 'FAQ1',
    url: '/faq',
    title: 'FAQ',
    external: false,
  },
  {
    name: 'Telegram',
    url: 'https://t.me/xfaiofficial',
    external: true,
    img: <Image src={telegram} alt="telegram" width={20} height={20}/>,
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/xfai_official',
    external: true,
    img: <Image src={twitter} alt="Twitter" width={25} height={20}/>,
  },
  {
    name: 'Github',
    url: 'https://github.com/Xfai-labs',
    external: true,
    img: <Image src={github} alt="Github" style={{width: 23, height: 23}}/>,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/xfai/',
    external: true,
    img: <Image src={linkedin} alt="LinkedIn" width={20} height={20}/>,
  },
  {
    name: 'Medium',
    url: 'https://xfai-official.medium.com/',
    external: true,
    img: <Image src={medium} alt="Medium" width={25} height={20}/>,
  },
  // to do later we should use.
  {
    name: 'FAQ2',
    url: '/faq',
    external: false,
    title: 'FAQ',
  },
  {
    name: 'Email',
    title: 'Email us',
    url: 'mailto:info@xfai.com',
    external: true,
    img: <Image src={email} alt="email us" style={{width: 21, height: 15}}/>,
  },
];

const NavLink = ({children, ...rest}) => (
  <Link
    fontSize={16}
    fontWeight={600}
    color="white"
    _hover={{
      textDecoration: "none",
    }}
    href={"#"}
    {...rest}
  >
    {children}
  </Link>
);

const NavHeaderExcludes = ['FAQ2'];


const NavLinkExt = ({children, ...rest}) => {
  const {name, url, external} = rest.link;

  return !external ?
    <Link
      fontSize={rest.fontSize}
      fontWeight={rest.fontWeight}
      color="white"
      _hover={{
        textDecoration: "none",
      }}
      href={url}
      {...rest}
    >
      {children}
    </Link> :
    <a href={url} target="_blank" style={{fontSize: rest.fontSize, fontWeight: rest.fontWeight}}>{children}</a>
    ;
};

export function NavIcons({
                           links,
                           iconOnly,
                           position,
                           fontSize,
                           iconWidth,
                           excludes,
                         }) {
  return (
    <>{
      links.map((link) => {
        if (_.indexOf(excludes, link.name) >= 0) {
          return;
        }

        let child = (
          <NavLinkExt
            key={link.name}
            link={link}
          >
            {(iconOnly && link.img) ? link.img : (link.title || link.name)}
          </NavLinkExt>
        );
        return <Box key={link.name} className={`menu-item ${link.name} ${iconOnly && link.img ? "icon" : ""}`}>{child}</Box>;
      })
    }
    </>
  );
}


export function Header() {
  const [loading, setLoading] = useState(false);
  const [visibleErrorModal, setVisibleErrorModal] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState('');
  const [firstLoaded, setFirstLoaded] = useState(false);

  const [xfitPrice, setXfitPrice] = useState(null);
  const {isOpen, onOpen, onClose} = useDisclosure();

  // connect modal
  const {isOpen: isOpenConnect, onOpenConnect, onCloseConnect} = useDisclosure();

  const curNetworkId = useSelector((state) => state.authUser.networkId);
  const account = useSelector((state) => state.authUser.address);
  const error = useSelector((state) => state.authUser.error);
  const loggedIn = useSelector((state) => state.authUser.loggedIn);
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchPoolInfo = useCallback(async () => {
    if (!account) {
      setXfitPrice(null);
      return;
    }

    // check if user's is logged in. If not, we will run nothing.
    if (!isLoggedIn(curNetworkId, account)) return;

    console.log("Fetching pool info.");
    // fetching data now.
    try {
      const poolRes = await updatePoolInfo(account);
      dispatch(setCurrentAPY(poolRes.apy));
      dispatch(setCurrentAPR(poolRes.apr));
      dispatch(setPoolList(poolRes.poolList));
      setXfitPrice(poolRes.totalDirectPrice);
      dispatch(setUserPoolList(poolRes.userPoolInfo));
      dispatch(setUserTotalInfo(poolRes.userTotalInfo));
    } catch (e) {
      dispatch(setInitData());
      setXfitPrice(null);
    }
  }, [dispatch, account]);

  useEffect(() => {
    if (firstLoaded || !loading) {
      if (loggedIn) {
        setLoading(true);
        fetchPoolInfo().then((res) => {
          setLoading(false);
        });
      }
    }
  }, [loggedIn]);

  useEffect(() => {
    if (error && typeof error == 'string') {
      // NotificationManager.warning(error);
      setVisibleErrorModal(true);
      setErrorModalMsg(error);
    } else {
      setVisibleErrorModal(false);
      setErrorModalMsg('');
    }
  }, [error]);

  useEffect(() => {
    if (!window.web3 || !account) return;
    if (!firstLoaded && !loading && location.pathname != '/faq')
      setLoading(true);

    // Fetch pool data and process result in callback.
    fetchPoolInfo().then((res) => {
      if (!firstLoaded && !loading && location.pathname != '/faq') {
        setLoading(false);
        setFirstLoaded(true);
      }
    });

    const interval = setInterval(async () => {
      fetchPoolInfo();
    }, 60000);

    return () => clearInterval(interval);
  }, [account, fetchPoolInfo]);

  /**
   * Network change hook.
   * */
  useEffect(() => {
    if (!window.web3 || !account) {
      setLoading(false);
      return;
    }
    if (curNetworkId != networkId) {
      setLoading(false);
      return;
    }
    ;

    if (location.pathname != '/faq') {
      setLoading(true);
    }

    // Fetch pool data and process result in callback.
    fetchPoolInfo().then((res) => {
      if (location.pathname != '/faq') {
        setLoading(false);
      }
    });
  }, [curNetworkId]);

  const getStartBlock = useCallback(async () => {
    const xfaiContract = getXfaiContract();
    const startBlock = await xfaiContract.methods.startBlock().call();
    dispatch(setStartBlock(startBlock));
  }, [dispatch]);

  useEffect(() => {
    if (account) {
      getStartBlock();
    }
  }, [account, getStartBlock]);

  const renderHamburgerButton = (isTop) => {
    return <>
      <div className={`hamburger${(!isTop && isOpen) ? ' is-active' : ''}`}>
        <IconButton
          icon={!isTop && isOpen ? <CloseIcon/> : <HamburgerIcon/>}
          onClick={isOpen ? onClose : onOpen}
        />
      </div>
    </>;
  }

  return (
    <>
      <Box className="top-border" __css={{backgroundImage: `url(${topBorderBg})`}}></Box>
      <Box className="nav-wrap"
           data-aos="nav-animation"
           data-aos-anchor="body"
           data-aos-anchor-placement="top-top"
      >
        <div className="container-wrap">
          <Flex
            px={0}
            alignItems={"center"}
            justifyContent={''/*"space-between"*/}
            className="nav-inner"

          >
            <HStack className="h-stack">
              <NavLink href="/" display={isOpen ? "none" : "unset"}>
                <Image src={logo} alt="logo" className="logo"/>
              </NavLink>
              <Box
                borderRightWidth={1}
                className="nav-sep"
              />
              <HStack as={"nav"} spacing={3} display={{base: "none", md: "flex"}} className="menu-items">
                <NavIcons links={LinksUrls} iconOnly excludes={NavHeaderExcludes}/>
              </HStack>
            </HStack>
            <Flex alignItems="center" className="nav-btn-wrap">
              {account && xfitPrice ? (
                <StyledButton
                  className="grey balance menu-item-balance"
                  style={{marginRight: "20px"}}
                >
                  <span style={{fontSize: 16, color: "#FC307B"}}>XFIT:</span>
                  &nbsp;
                  {`$${xfitPrice ? nf(xfitPrice, 0, 4) : 0}`}
                  <Tooltip sid={`ht-xfit`} label="XFIT is the token of XFAI. This displays the current value of the token in US Dollars." marginBottom={'10px'}/>
                </StyledButton>
              ) : (
                <></>
              )}
              <ConnectWalletModal onCloseHamburger={onClose}/>
            </Flex>
            {renderHamburgerButton(1)}
          </Flex>
        </div>
      </Box>

      <div className={`sidebar-left-nav${isOpen ? ' is-active' : ''}`}>
        <Box>
          {renderHamburgerButton()}
          <Stack as={"nav"} spacing={2} align="center" className="menu-items">
            {account && xfitPrice ? (
              <StyledButton
                className="grey menu-item-balance"
              >
                <span style={{fontSize: 16, color: "#FC307B"}}>XFIT:</span>
                &nbsp;
                {`$${xfitPrice ? nf(xfitPrice, 0, 4) : 0}`}
                <Tooltip sid={`ht-xfit`} label="XFIT is the token of XFAI. This displays the current value of the token in US Dollars." marginBottom={'10px'}/>
              </StyledButton>
            ) : (
              <></>
            )}
            <ConnectWalletModal
              onCloseHamburger={onClose}
            />
            <VStack className="icons-wrap">
              <NavIcons links={LinksUrls} excludes={['FAQ1']}/>
            </VStack>
          </Stack>
        </Box>
      </div>
      {/*<Box className="nav-wrap second"
           style={{position: 'relative', zIndex: 0}}></Box>*/}

      {(loading) && <LoadingPoolData loading={loading}/>}
      {(visibleErrorModal) && <ErrorMessageModal loading={visibleErrorModal} />}
    </>
  );
}
