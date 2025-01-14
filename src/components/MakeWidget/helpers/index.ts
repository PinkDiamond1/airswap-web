import i18n from "i18next";

export const getActionButtonTranslation = (
  hasInsufficientAllowance: boolean,
  hasInsufficientBalance: boolean,
  hasInsufficientExpiry: boolean,
  hasMissingMakerAmount: boolean,
  hasMissingMakerToken: boolean,
  hasMissingTakerAmount: boolean,
  hasMissingTakerToken: boolean,
  networkIsUnsupported: boolean,
  shouldDepositNativeToken: boolean,
  takerAddressIsInvalid: boolean,
  walletIsNotConnected: boolean,
  makerTokenSymbol?: string,
  takerTokenSymbol?: string
): string => {
  if (walletIsNotConnected) {
    return i18n.t("wallet.connectWallet");
  }

  if (networkIsUnsupported) {
    return i18n.t("wallet.unsupportedNetwork");
  }

  if (hasInsufficientExpiry) {
    return i18n.t("orders.expiryShouldBeMoreThan0");
  }

  if (hasMissingMakerToken || hasMissingTakerToken) {
    return i18n.t("orders.chooseToken");
  }

  if (hasMissingMakerAmount) {
    return i18n.t("orders.enterTokenAmount", { symbol: makerTokenSymbol });
  }

  if (hasMissingTakerAmount) {
    return i18n.t("orders.enterTokenAmount", { symbol: takerTokenSymbol });
  }

  if (shouldDepositNativeToken) {
    return `Wrap ${makerTokenSymbol}`;
  }

  if (hasInsufficientBalance) {
    return i18n.t("orders.insufficentBalance", { symbol: makerTokenSymbol });
  }

  if (hasInsufficientAllowance) {
    return `${i18n.t("orders.approve")} ${makerTokenSymbol}`;
  }

  if (takerAddressIsInvalid) {
    return i18n.t("orders.enterValidTakerAddress");
  }

  return i18n.t("common.sign");
};
