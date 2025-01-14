import { FullOrder } from "@airswap/typescript";
import { TokenInfo } from "@uniswap/token-lists";

import { BigNumber } from "bignumber.js";

import { OrdersSortType } from "../../../features/myOrders/myOrdersSlice";
import findEthOrTokenByAddress from "../../../helpers/findEthOrTokenByAddress";

export const getTokenAmountWithDecimals = (
  amount: string,
  decimals: number = 18
): BigNumber => {
  return new BigNumber(amount).div(10 ** decimals);
};

const sortTokensBySymbol = (
  a: string,
  b: string,
  tokens: TokenInfo[],
  chainId: number
) => {
  const token1 = findEthOrTokenByAddress(a, tokens, chainId);
  const token2 = findEthOrTokenByAddress(b, tokens, chainId);

  return token1.symbol.toLocaleLowerCase() < token2.symbol.toLocaleLowerCase()
    ? -1
    : 1;
};

export const getSortedOrders = (
  orders: FullOrder[],
  sortType: OrdersSortType,
  tokens: TokenInfo[],
  chainId: number,
  isReverse: boolean
) => {
  const array = [...orders];

  if (sortType === "senderToken") {
    array.sort((a, b) =>
      sortTokensBySymbol(a.senderToken, b.senderToken, tokens, chainId)
    );
  }

  if (sortType === "signerToken") {
    array.sort((a, b) =>
      sortTokensBySymbol(a.signerToken, b.signerToken, tokens, chainId)
    );
  }

  // TODO: sort on order canceled or not
  if (sortType === "active" || sortType === "expiry") {
    array.sort((a, b) => {
      return parseInt(b.expiry) - parseInt(a.expiry);
    });
  }

  if (isReverse) {
    array.reverse();
  }

  return array;
};
