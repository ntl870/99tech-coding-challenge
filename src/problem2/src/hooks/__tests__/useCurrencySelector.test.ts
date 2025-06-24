import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCurrencySelector } from "../useCurrencySelector";
import type { Currency } from "../../types";

// Mock useClickOutside
vi.mock("../useClickOutside", () => ({
  useClickOutside: vi.fn(),
}));

describe("useCurrencySelector", () => {
  const mockCurrencies: Currency[] = [
    { symbol: "BTC", name: "Bitcoin", price: 50000, icon: "/btc.svg" },
    { symbol: "ETH", name: "Ethereum", price: 2500, icon: "/eth.svg" },
    { symbol: "ADA", name: "Cardano", price: 1.5, icon: "/ada.svg" },
  ];

  const mockOnSelect = vi.fn();

  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useCurrencySelector({
        currencies: mockCurrencies,
        onSelect: mockOnSelect,
      })
    );

    expect(result.current.isOpen).toBe(false);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.filteredCurrencies).toEqual(mockCurrencies);
  });

  it("should toggle dropdown", () => {
    const { result } = renderHook(() =>
      useCurrencySelector({
        currencies: mockCurrencies,
        onSelect: mockOnSelect,
      })
    );

    act(() => {
      result.current.handleToggleDropdown();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.handleToggleDropdown();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("should filter currencies by symbol", () => {
    const { result } = renderHook(() =>
      useCurrencySelector({
        currencies: mockCurrencies,
        onSelect: mockOnSelect,
      })
    );

    const mockEvent = {
      target: { value: "BTC" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleSearchChange(mockEvent);
    });

    expect(result.current.searchTerm).toBe("BTC");
    expect(result.current.filteredCurrencies).toEqual([mockCurrencies[0]]);
  });

  it("should filter currencies by name (case insensitive)", () => {
    const { result } = renderHook(() =>
      useCurrencySelector({
        currencies: mockCurrencies,
        onSelect: mockOnSelect,
      })
    );

    const mockEvent = {
      target: { value: "bitcoin" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleSearchChange(mockEvent);
    });

    expect(result.current.searchTerm).toBe("bitcoin");
    expect(result.current.filteredCurrencies).toEqual([mockCurrencies[0]]);
  });

  it("should handle currency selection", () => {
    const { result } = renderHook(() =>
      useCurrencySelector({
        currencies: mockCurrencies,
        onSelect: mockOnSelect,
      })
    );

    // Open dropdown first
    act(() => {
      result.current.handleToggleDropdown();
    });

    expect(result.current.isOpen).toBe(true);

    // Select a currency
    act(() => {
      result.current.handleSelect(mockCurrencies[0]);
    });

    expect(mockOnSelect).toHaveBeenCalledWith(mockCurrencies[0]);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.searchTerm).toBe("");
  });

  it("should return empty array when no currencies match search", () => {
    const { result } = renderHook(() =>
      useCurrencySelector({
        currencies: mockCurrencies,
        onSelect: mockOnSelect,
      })
    );

    const mockEvent = {
      target: { value: "xyz" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleSearchChange(mockEvent);
    });

    expect(result.current.filteredCurrencies).toEqual([]);
  });
});
