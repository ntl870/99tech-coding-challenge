import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useExchangeForm } from "../useExchangeForm";
import type { Currency } from "../../types";

// Mock the getExchangeRate function
vi.mock("../../utils/tools", () => ({
  getExchangeRate: vi.fn((from: Currency, to: Currency) => {
    if (from && to) {
      return `1 ${from.symbol} = 2.000000 ${to.symbol}`;
    }
    return "";
  }),
}));

describe("useExchangeForm", () => {
  const mockFromCurrency: Currency = {
    symbol: "BTC",
    name: "Bitcoin",
    price: 50000,
    icon: "/btc.svg",
  };

  const mockToCurrency: Currency = {
    symbol: "ETH",
    name: "Ethereum",
    price: 2500,
    icon: "/eth.svg",
  };

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useExchangeForm());

    expect(result.current.fromCurrency).toBe(null);
    expect(result.current.toCurrency).toBe(null);
    expect(result.current.fromAmount).toBe("");
    expect(result.current.toAmount).toBe("");
    expect(result.current.isCalculating).toBe(false);
    expect(result.current.exchangeRate).toBe("");
  });

  it("should update currencies", () => {
    const { result } = renderHook(() => useExchangeForm());

    act(() => {
      result.current.setFromCurrency(mockFromCurrency);
      result.current.setToCurrency(mockToCurrency);
    });

    expect(result.current.fromCurrency).toEqual(mockFromCurrency);
    expect(result.current.toCurrency).toEqual(mockToCurrency);
  });

  it("should handle valid amount input", () => {
    const { result } = renderHook(() => useExchangeForm());

    const mockEvent = {
      target: { value: "1.5" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFromAmountChange(mockEvent);
    });

    expect(result.current.fromAmount).toBe("1.5");
  });

  it("should reject invalid amount input", () => {
    const { result } = renderHook(() => useExchangeForm());

    const mockEvent = {
      target: { value: "abc" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFromAmountChange(mockEvent);
    });

    expect(result.current.fromAmount).toBe("");
  });

  it("should calculate exchange amount", async () => {
    const { result } = renderHook(() => useExchangeForm());

    act(() => {
      result.current.setFromCurrency(mockFromCurrency);
      result.current.setToCurrency(mockToCurrency);
    });

    const mockEvent = {
      target: { value: "1" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFromAmountChange(mockEvent);
    });

    expect(result.current.isCalculating).toBe(true);

    await waitFor(
      () => {
        expect(result.current.isCalculating).toBe(false);
      },
      { timeout: 1000 }
    );

    expect(result.current.toAmount).toBe("20.000000");
  });

  it("should swap currencies", () => {
    const { result } = renderHook(() => useExchangeForm());

    act(() => {
      result.current.setFromCurrency(mockFromCurrency);
      result.current.setToCurrency(mockToCurrency);
    });

    act(() => {
      result.current.handleSwapCurrencies();
    });

    expect(result.current.fromCurrency).toEqual(mockToCurrency);
    expect(result.current.toCurrency).toEqual(mockFromCurrency);
  });

  it("should handle form submission", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() => useExchangeForm());

    act(() => {
      result.current.setFromCurrency(mockFromCurrency);
      result.current.setToCurrency(mockToCurrency);
    });

    const mockEvent = {
      target: { value: "1" },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFromAmountChange(mockEvent);
    });

    const formEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleConfirmSwap(formEvent);
    });

    expect(formEvent.preventDefault).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
