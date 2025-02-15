import { TokenInfo } from "@airswap/typescript";

import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import TokenLogo from "../../../TokenLogo/TokenLogo";
import {
  Container,
  Symbol,
  TokenName,
  Balance,
  DeleteIcon,
  TokenSymbolAndName,
} from "./TokenButton.styles";

export type TokenRowProps = {
  /**
   * TokenInfo object
   */
  token: TokenInfo;
  /**
   * Balance of current token
   */
  balance: string;
  /**
   * onClick event, either setSignerToken or setSenderToken
   */
  setToken: (val: string) => void;
  /**
   * Whether to disable selection of this token (e.g. if already selected)
   */
  disabled?: boolean;
  /**
   * Removes token from the active tokens list.
   */
  removeActiveToken: (tokenAddress: string) => void;
  /**
   * Show delete button
   */
  showDeleteButton?: boolean;
};

const TokenButton = ({
  token,
  balance,
  setToken,
  removeActiveToken,
  disabled = false,
  showDeleteButton = false,
}: TokenRowProps) => {
  const onClickHandler = () => {
    if (disabled) {
      return;
    }

    if (!showDeleteButton) {
      setToken(token.address);
    } else {
      removeActiveToken(token.address);
    }
  };

  return (
    <Container
      onClick={onClickHandler}
      disabled={disabled}
      showDeleteButton={showDeleteButton}
    >
      <TokenLogo tokenInfo={token} size="small" />

      <TokenSymbolAndName>
        <Symbol>{token.symbol}</Symbol>
        <TokenName>{token.name}</TokenName>
      </TokenSymbolAndName>

      {showDeleteButton ? (
        <DeleteIcon name="deny" />
      ) : (
        <Balance>{stringToSignificantDecimals(balance)}</Balance>
      )}
    </Container>
  );
};

export default TokenButton;
