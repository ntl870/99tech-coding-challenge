import { useMemo } from "react";
import { useFetch } from "./useFetch";
import type { ExchangeRate, Currency } from "../types";
import { getCurrencyName } from "../utils/tools";
import { API_ENDPOINTS } from "../constants/endpoints";

interface UseExchangeSiteReturn {
  currencies: Currency[];
  loading: boolean;
  error: string | null;
}

export function useExchangeSite(): UseExchangeSiteReturn {
  const {
    data: exchangeRates,
    loading,
    error,
  } = useFetch<ExchangeRate[]>(API_ENDPOINTS.EXCHANGE_RATES);

  const currencies = useMemo<Currency[]>(() => {
    if (!exchangeRates) return [];

    // Group by currency symbol and get the latest price for each
    const currencyMap = new Map<string, ExchangeRate>();

    exchangeRates.forEach((rate) => {
      const existing = currencyMap.get(rate.currency);
      if (!existing || new Date(rate.date) > new Date(existing.date)) {
        currencyMap.set(rate.currency, rate);
      }
    });

    return Array.from(currencyMap.values())
      .map((rate) => ({
        symbol: rate.currency,
        name: getCurrencyName(rate.currency),
        price: rate.price,
        icon: `/src/assets/${rate.currency}.svg`,
      }))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [exchangeRates]);

  return {
    currencies,
    loading,
    error,
  };
}
