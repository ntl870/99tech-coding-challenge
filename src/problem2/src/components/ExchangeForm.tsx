import type { Currency } from "../types";
import { useExchangeForm } from "../hooks";
import CurrencySelector from "./CurrencySelector";

interface ExchangeFormProps {
  currencies: Currency[];
}

const ExchangeForm = ({ currencies }: ExchangeFormProps) => {
  const {
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
  } = useExchangeForm();

  return (
    <form className="exchange-form" onSubmit={handleConfirmSwap}>
      <h5>Swap</h5>

      <div className="form-group">
        <label htmlFor="input-amount">Amount to send</label>
        <div className="input-container">
          <input
            id="input-amount"
            type="text"
            value={fromAmount}
            onChange={handleFromAmountChange}
            placeholder="0.00"
            className="amount-input"
          />
          <CurrencySelector
            currencies={currencies}
            selectedCurrency={fromCurrency}
            onSelect={setFromCurrency}
            placeholder="From"
          />
        </div>
      </div>

      <div className="swap-button-container">
        <button
          type="button"
          className="swap-currencies-btn"
          onClick={handleSwapCurrencies}
          disabled={!fromCurrency || !toCurrency}
        >
          ⇅
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="output-amount">Amount to receive</label>
        <div className="input-container">
          <input
            id="output-amount"
            type="text"
            value={isCalculating ? "Calculating..." : toAmount}
            readOnly
            placeholder="0.00"
            className="amount-input"
          />
          <CurrencySelector
            currencies={currencies}
            selectedCurrency={toCurrency}
            onSelect={setToCurrency}
            placeholder="To"
          />
        </div>
      </div>

      {exchangeRate && <div className="exchange-rate">{exchangeRate}</div>}

      <button
        type="submit"
        className="confirm-button"
        disabled={!fromCurrency || !toCurrency || !fromAmount || isCalculating}
      >
        CONFIRM SWAP
      </button>
    </form>
  );
};

export default ExchangeForm;
