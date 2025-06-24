import { useState, useEffect } from "react";
import type { Currency } from "../types";
import { getExchangeRate } from "../utils/tools";

interface UseExchangeFormReturn {
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  fromAmount: string;
  toAmount: string;
  isCalculating: boolean;
  exchangeRate: string;
  setFromCurrency: (currency: Currency | null) => void;
  setToCurrency: (currency: Currency | null) => void;
  handleFromAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwapCurrencies: () => void;
  handleConfirmSwap: (e: React.FormEvent) => void;
}

export function useExchangeForm(): UseExchangeFormReturn {
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
  const [toCurrency, setToCurrency] = useState<Currency | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate exchange rate and convert amounts
  useEffect(() => {
    if (
      fromCurrency &&
      toCurrency &&
      fromAmount &&
      !isNaN(Number(fromAmount))
    ) {
      setIsCalculating(true);

      // Simulate calculation delay for better UX
      const timer = setTimeout(() => {
        const fromPrice = fromCurrency.price;
        const toPrice = toCurrency.price;
        const rate = fromPrice / toPrice;
        const calculatedAmount = Number(fromAmount) * rate;

        setToAmount(calculatedAmount.toFixed(6));
        setIsCalculating(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setToAmount("");
      setIsCalculating(false);
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount("");
  };

  const handleConfirmSwap = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromCurrency || !toCurrency || !fromAmount) return;

    alert(
      `Swap confirmed!\nSending: ${fromAmount} ${fromCurrency.symbol}\nReceiving: ${toAmount} ${toCurrency.symbol}`
    );
  };

  const exchangeRate = getExchangeRate(fromCurrency, toCurrency);

  return {
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    isCalculating,
    exchangeRate,
    setFromCurrency,
    setToCurrency,
    handleFromAmountChange,
    handleSwapCurrencies,
    handleConfirmSwap,
  };
}
