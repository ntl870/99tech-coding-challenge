import type { Currency } from "../types";

// Helper function to get display names for currencies
export function getCurrencyName(symbol: string): string {
  const names: Record<string, string> = {
    USD: "US Dollar",
    ETH: "Ethereum",
    BTC: "Bitcoin",
    USDC: "USD Coin",
    BUSD: "Binance USD",
    ATOM: "Cosmos",
    STATOM: "Staked ATOM",
    OSMO: "Osmosis",
    LUNA: "Terra Luna",
    STLUNA: "Staked Luna",
    RATOM: "Rocket Pool ATOM",
    STRD: "Stride",
    EVMOS: "Evmos",
    STEVMOS: "Staked EVMOS",
    WBTC: "Wrapped Bitcoin",
    GMX: "GMX",
    BLUR: "Blur",
    KUJI: "Kujira",
    STOSMO: "Staked OSMO",
    wstETH: "Wrapped Staked ETH",
    ampLUNA: "Amplified Luna",
    axlUSDC: "Axelar USDC",
    rSWTH: "Reward SWTH",
    SWTH: "Switcheo",
    USC: "USD Coin",
    YieldUSD: "Yield USD",
    ZIL: "Zilliqa",
    LSI: "Liquid Staking Index",
    OKB: "OKEx Token",
    OKT: "OKChain Token",
    IRIS: "IRISnet",
    IBCX: "IBC Index",
    bNEO: "Binance NEO",
  };

  return names[symbol] || symbol;
}

export function getExchangeRate(
  fromCurrency: Currency | null,
  toCurrency: Currency | null
): string {
  if (fromCurrency && toCurrency) {
    const rate = fromCurrency.price / toCurrency.price;
    return `1 ${fromCurrency.symbol} = ${rate.toFixed(6)} ${toCurrency.symbol}`;
  }
  return "";
}
