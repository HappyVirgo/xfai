import React from 'react';
import {Box, Text} from '@chakra-ui/react';

const FaqDef = [
  {
    title: 'What is XFai?',
    paragraph: <>
      XFai builds tooling to make DeFi accessible and highly liquid for users. We concentrate on fixing so called variance problems that users encounter day to day on DeFi. We are starting with our first product which is the DLO (DEX Liquidity Oracle) which aims to remove the barriers to trading
      efficiently on AMMs such as Uniswap, and make on-chain trading both more efficient and more profitable than CEX (Centralized Exchange) trading. VIA the DLO small and mid-cap tokens will have the possibility to amass liquidity on-chain and therefore get access to other DeFi lego bricks such as
      lending protcols, margin, etc, which they today can't access due to sitting on CEXs.
    </>,
  },
  {
    title: 'How we are different to other oracles?',
    paragraph: <>
      The only thing we do in terms of oracle is observe the CEX orderbooks and construct a synthetic curve, which then gets sent to the DLO contract as an update (this is the oracle part). The DLO then manages liquidity. Normal Oracles such as Chainlink or Dia don't manage liquidity. Essentially
      the price and liquidity of a token gets updated, rather than just data. We therefore don't compete directly with Chainlink or Dia
    </>,
  },
  {
    title: 'What is impermanent gain?',
    paragraph: <>
      Impermanent gain is something we haven't seen anyone else discuss so far but it is extremely important to the whole AMM space. Impermanent loss (or as some call it now divergence loss) happens when the *price* of the token moves (either up or down), while keeping the liquidity in the pools the
      same. Impermanent gain happens to prior LPs when the price moves far less, but the liquidity increases instead. That way the net value of your prior LP increases more than the impermanent loss. This happens due to how Uniswap and others issue ever-decreasing LP amounts as more liquidity comes
      in. This is why in our LGE we focus on keeping the price fairly stable, that way your APY isn’t there to make up for the impermanent loss but is rather pure profit (https://www.dextools.io/app/uniswap/pair-explorer/0xf8d99cf7046dedcb1dc8cfc309aa96946c9b9db2).
    </>,
  },
  {
    title: 'What Benefit does the LGE offer?',
    paragraph: <>
      APY. Rather than to make up for covering impermanent loss. Because of very high TVL (10M a the time of writing ) and few tokens being in the hands of speculators, as well as due to how farmers buy up supply on Uniswap via our one-click interaction, you experience as an LP very little to no IL.
      This means that long-term investors in XFai are farming rather than hodling, which in turn creates a virtuous cycle of creating more liquidity and more price stability
    </>,
  },
  {
    title: 'What solution has XFai come up with to help address the issue of DeFi Bot most especially that of uniswap?',
    paragraph: <>
      Several strategies. <br/>
      <Text my={1}>1. We seeded the pool 2 hours early with dust. Bots that didn't know about us got stuck.</Text>
      <Text my={1}>2. An hour before the LGE we seeded with 4.63M TVL, which created very deep pools and therefore required millions from the bots to push up the price for a pumo and dump.</Text>
      <Text my={1}>3. We work with a Market Maker who in real-time identified pump attacks and sold against them the hour before the LGE.</Text>
      <Text my={1}>4. The farming price at which users get the tokens via the 1 click transaction (+ the allowance transaction) was the moving average of the last hour, which gets rid of short-term pumps. This was by far the best decision. This approach only works with our stable price approach of a target
        between 0.1-0.2 USD.</Text>
      <Text my={1}>5. Flash loan arbitragers are long on XFIT so they are going XFIT-USDT-USDC-XFIT and are accumulating a position in XFIT instead of the opposite of what is normally happening.</Text>
      <Text my={1}>6. Our two pools are USDT and USDC, which leads to people, not panic selling or panic removing liquidity during a sharp downturn. </Text>
    </>
  },
  {
    title: 'Has your contract been audited?',
    paragraph: <>
      <p>Yes, find the report here: </p>
      <p>https://omniscia.io/xfai-amplify-contracts</p>
    </>
  },
  {
    title: 'What is a Buy and Make strategy?',
    paragraph: <>
      We use a portion of profits to buy XFIT on AMMs (such a the two pools generated during our LGE now), and instead of burning the bought XFIT, we provide it as liquidity together with the other token, and *then* burn the LP token. This creates both an upwards price pressure as well as a
      liquidity buffer. Therefore LPs don't get exposed to Impermanent Loss, and it starts to make a ton of sense for lending protcols such as aave, compound, etc to list the XFIT LPs as collateral. The value proposition is that if you are long on XFAI, you will never actually have to sell XFIT to
      realize your profit. The DLO aims to help other tokens do the same
    </>
  },
  {
    title: 'How many tokens are allocated to the LGE?',
    paragraph: <>
      202.5m tokens are allocated for the LGE. The tokens for the IDO will be announced in due course.
    </>
  },
  {
    title: 'How long will phase 1 last?',
    paragraph: <>
      On Day 1, we saw an incredible amount of demand that almost halted the entire ETH chain. You can see that the TVL is higher than almost any other DeFi project that launched in the recent days. On Day 2, we are looking at over 1M USD as new farming that came in. Transactions are continuing to
      come in, and we are seeing a steady stream of new liquidity farmers coming in.
      We will continue monitoring the progress. The demand that everyone witnessed within a matter of a few hours on day 1 was not captured fully due to the ETH network issue. So now it is a matter of how fast this interest will come into the pool, which we will be able to see in the coming days.
      That will determine when Stage 2 happens.

    </>
  },
  {
    title: 'How long do I have to farm for?',
    paragraph: <>
      The farming period will last 6 months. You can exit whenever you like. The longer you farm the more reward you will earn
    </>
  },
  {
    title: 'If I have both USDC and USDT in my wallet, could I add both to farm separately?',
    paragraph: <>
      You can add both seperately, no conversion needed. The global drip rate gets split dynamically between the different stablecoin pools based on their relative size.
    </>
  },
  {
    title: 'Is there any lock for LP tokens?',
    paragraph: <>
      No Lockup period. For protection against flash loan attacks you can't redeem/unstake your tokens within the same block though. Also keep in mind that when unstaking / redeeming you pay normal gas fees which you need to take into consideration when making your financial calculation.
    </>
  },
  {
    title: 'Can you stake tokens from UniSwap?',
    paragraph: <>
      Farming is only possible with USDT and USDC on our website directly.
    </>
  },
  {
    title: 'Is it better to Farm or to buy on Uniswap?',
    paragraph: <>
      We designed the system so that people who are long on XFIT are better off farming directly. People who just want to hold XFIT or speculate are better off buying directly on Uniswap.
    </>
  },
  {
    title: 'How long will the Potentializer be stabilizing the price?',
    paragraph: <>
      The LGE process is designed to last for a maximum of 21 days (now 19 days max remaining). However, the LGE stage 1 completes when the overall demand meets the liquidity target. So it may be much shorter than 21 days total.
      We will keep updating the community on a daily basis so that everyone can have a clear overview of how the LGE Stage 1 is going, and when the stage 2 will begin.
      Farming will be live for 6 months.

    </>
  },
  {
    title: 'Why is the gas fee high?',
    paragraph: <>
      <Box mb={2}>In comparison to traditional farming, the cost of gas fees is smaller, because there is no slippage. You don't have to be afraid of a transaction failing because of race conditions on ethereum. You're exposed to much more risk paying 3 times gas that way. It's really that simple. gas prices
      add up, but it's less risky to do it that way because your transaction gets accepted even if the price feed happens to suddenly change.
      </Box>
      <img width="100%" src="/compare.png"/>
    </>
  },
];
export default FaqDef;