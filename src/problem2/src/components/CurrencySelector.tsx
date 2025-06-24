import React from "react";
import type { Currency } from "../types";
import { useCurrencySelector } from "../hooks";

interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelect: (currency: Currency) => void;
  placeholder?: string;
}

const CurrencySelector = ({
  currencies,
  selectedCurrency,
  onSelect,
  placeholder = "Select currency",
}: CurrencySelectorProps) => {
  const {
    isOpen,
    searchTerm,
    filteredCurrencies,
    dropdownRef,
    handleToggleDropdown,
    handleSelect,
    handleSearchChange,
  } = useCurrencySelector({ currencies, onSelect });

  return (
    <div className="currency-selector" ref={dropdownRef}>
      <button
        type="button"
        className="selector-button"
        onClick={handleToggleDropdown}
      >
        {selectedCurrency ? (
          <div className="selected-currency">
            {selectedCurrency.icon && (
              <img
                src={selectedCurrency.icon}
                alt={selectedCurrency.symbol}
                className="currency-icon"
              />
            )}
            <span className="currency-symbol">{selectedCurrency.symbol}</span>
            <span className="currency-name">{selectedCurrency.name}</span>
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="dropdown">
          <input
            type="text"
            className="search-input"
            placeholder="Search currencies..."
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
          <div className="currency-list">
            {filteredCurrencies.map((currency) => {
              const isSelected = selectedCurrency?.symbol === currency.symbol;
              return (
                <button
                  key={currency.symbol}
                  type="button"
                  className={`currency-option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(currency)}
                >
                  {currency.icon && (
                    <img
                      src={currency.icon}
                      alt={currency.symbol}
                      className="currency-icon"
                    />
                  )}
                  <div className="currency-info">
                    <span className="currency-symbol">{currency.symbol}</span>
                    <span className="currency-name">{currency.name}</span>
                  </div>
                  <div className="currency-option-right">
                    <span className="currency-price">
                      ${currency.price.toFixed(4)}
                    </span>
                    {isSelected && (
                      <span className="selected-indicator">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
            {filteredCurrencies.length === 0 && (
              <div className="no-results">No currencies found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
