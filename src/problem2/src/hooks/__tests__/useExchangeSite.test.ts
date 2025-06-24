import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useExchangeSite } from "../useExchangeSite";
import type { ExchangeRate } from "../../types";

// Mock useFetch
vi.mock("../useFetch", () => ({
  useFetch: vi.fn(),
}));

// Mock getCurrencyName
vi.mock("../../utils/tools", () => ({
  getCurrencyName: vi.fn((symbol: string) => `${symbol} Name`),
}));

// Mock API_ENDPOINTS
vi.mock("../../constants/endpoints", () => ({
  API_ENDPOINTS: {
    EXCHANGE_RATES: "/data",
  },
}));

import { useFetch } from "../useFetch";
const mockedUseFetch = vi.mocked(useFetch);

describe("useExchangeSite", () => {
  it("should return loading state", () => {
    mockedUseFetch.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useExchangeSite());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.currencies).toEqual([]);
  });

  it("should return error state", () => {
    const errorMessage = "Failed to fetch";
    mockedUseFetch.mockReturnValue({
      data: null,
      loading: false,
      error: errorMessage,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useExchangeSite());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.currencies).toEqual([]);
  });

  it("should transform exchange rates to currencies", () => {
    const mockExchangeRates: ExchangeRate[] = [
      {
        currency: "BTC",
        date: "2023-08-29T07:10:40.000Z",
        price: 50000,
      },
      {
        currency: "ETH",
        date: "2023-08-29T07:10:40.000Z",
        price: 2500,
      },
    ];

    mockedUseFetch.mockReturnValue({
      data: mockExchangeRates,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useExchangeSite());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.currencies).toEqual([
      {
        symbol: "BTC",
        name: "BTC Name",
        price: 50000,
        icon: "/src/assets/BTC.svg",
      },
      {
        symbol: "ETH",
        name: "ETH Name",
        price: 2500,
        icon: "/src/assets/ETH.svg",
      },
    ]);
  });

  it("should handle duplicate currencies and keep latest", () => {
    const mockExchangeRates: ExchangeRate[] = [
      {
        currency: "BTC",
        date: "2023-08-29T07:10:40.000Z",
        price: 50000,
      },
      {
        currency: "BTC",
        date: "2023-08-29T07:10:50.000Z", // Later date
        price: 51000,
      },
    ];

    mockedUseFetch.mockReturnValue({
      data: mockExchangeRates,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useExchangeSite());

    expect(result.current.currencies).toEqual([
      {
        symbol: "BTC",
        name: "BTC Name",
        price: 51000, // Should use the latest price
        icon: "/src/assets/BTC.svg",
      },
    ]);
  });

  it("should sort currencies alphabetically", () => {
    const mockExchangeRates: ExchangeRate[] = [
      {
        currency: "ZIL",
        date: "2023-08-29T07:10:40.000Z",
        price: 0.02,
      },
      {
        currency: "BTC",
        date: "2023-08-29T07:10:40.000Z",
        price: 50000,
      },
      {
        currency: "ETH",
        date: "2023-08-29T07:10:40.000Z",
        price: 2500,
      },
    ];

    mockedUseFetch.mockReturnValue({
      data: mockExchangeRates,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useExchangeSite());

    expect(result.current.currencies.map((c) => c.symbol)).toEqual([
      "BTC",
      "ETH",
      "ZIL",
    ]);
  });
});
