import { useMemo } from "react";

import { wrappedTokenAddresses } from "@airswap/constants";
import { toAtomicString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import {
  nativeCurrencyAddress,
  nativeCurrencySafeTransactionFee,
} from "../constants/nativeCurrency";
import { selectBalances } from "../features/balances/balancesSlice";
import { selectActiveTokens } from "../features/metadata/metadataSlice";
import { selectUserTokens } from "../features/userSettings/userSettingsSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import stringToSignificantDecimals from "../helpers/stringToSignificantDecimals";

const useShouldDepositNativeTokenAmount = (
  tokenAmount: string
): string | undefined => {
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);
  const userTokens = useAppSelector(selectUserTokens);

  const { chainId } = useWeb3React<Web3Provider>();
  const { tokenFrom } = userTokens;

  return useMemo(() => {
    if (!tokenFrom || !tokenAmount || !chainId) {
      return undefined;
    }

    if (tokenFrom !== nativeCurrencyAddress) {
      return undefined;
    }

    const wrappedTokenAddress = wrappedTokenAddresses[chainId];

    if (!wrappedTokenAddress) {
      return undefined;
    }

    const nativeTokenBalance = balances.values[nativeCurrencyAddress];
    const wrappedTokenBalance = balances.values[wrappedTokenAddress];

    if (!nativeTokenBalance || !wrappedTokenBalance) {
      return undefined;
    }

    const nativeTokenInfo = findEthOrTokenByAddress(
      nativeCurrencyAddress,
      activeTokens,
      chainId
    );
    const wrappedTokenInfo = findEthOrTokenByAddress(
      wrappedTokenAddress,
      activeTokens,
      chainId
    );

    const nativeTokenBigNumber = new BigNumber(nativeTokenBalance).div(
      10 ** nativeTokenInfo.decimals
    );
    const wrappedTokenBigNumber = new BigNumber(wrappedTokenBalance).div(
      10 ** wrappedTokenInfo.decimals
    );
    const tokenAmountBigNumber = new BigNumber(
      toAtomicString(tokenAmount, nativeTokenInfo.decimals)
    ).div(10 ** nativeTokenInfo.decimals);

    const totalBigNumber = nativeTokenBigNumber
      .plus(wrappedTokenBigNumber)
      .minus(nativeCurrencySafeTransactionFee[chainId] || 0);

    // If user has the required WETH amount then it's not necessary to wrap: we'll just use the WETH
    if (wrappedTokenBigNumber.isGreaterThanOrEqualTo(tokenAmount)) {
      return undefined;
    }

    // If the ETH and WETH amount is not sufficient then wrapping ETH will not help
    if (totalBigNumber.isLessThan(tokenAmount)) {
      return undefined;
    }

    // Else it means WETH is not enough, but with wrapping extra ETH it will.
    return stringToSignificantDecimals(
      tokenAmountBigNumber.minus(wrappedTokenBigNumber).toFormat()
    );
  }, [activeTokens, balances.values, tokenFrom, tokenAmount, chainId]);
};

export default useShouldDepositNativeTokenAmount;
