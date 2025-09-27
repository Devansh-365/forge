// @ts-expect-error - currency-symbol-map/map is not typed but it does return a map of all symbol and currency code
import currencyToSymbolMap from "currency-symbol-map/map";
import getSymbolFromCurrency from "currency-symbol-map";
export const currenciesWithSymbols: Record<string, string> = currencyToSymbolMap;

export const formatCurrencyText = (currency: string, amount: number) => {
  return `${getSymbolFromCurrency(currency)}${amount.toFixed(2)}`;
};
