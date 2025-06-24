import { useState, useRef } from "react";
import type { Currency } from "../types";
import { useClickOutside } from "./useClickOutside";

interface UseCurrencySelectorProps {
  currencies: Currency[];
  onSelect: (currency: Currency) => void;
}

interface UseCurrencySelectorReturn {
  isOpen: boolean;
  searchTerm: string;
  filteredCurrencies: Currency[];
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  setSearchTerm: (term: string) => void;
  handleToggleDropdown: () => void;
  handleSelect: (currency: Currency) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useCurrencySelector({
  currencies,
  onSelect,
}: UseCurrencySelectorProps): UseCurrencySelectorReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  useClickOutside({ ref: dropdownRef, callback: handleClickOutside });

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    isOpen,
    searchTerm,
    filteredCurrencies,
    dropdownRef,
    setSearchTerm,
    handleToggleDropdown,
    handleSelect,
    handleSearchChange,
  };
}
