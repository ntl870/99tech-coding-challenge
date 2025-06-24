import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useFetch } from "../useFetch";

vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("useFetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useFetch("/test", { skip: true }));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("should fetch data successfully", async () => {
    const mockData = { id: 1, name: "Test" };
    mockedAxios.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useFetch("/test"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it("should handle errors", async () => {
    const errorMessage = "Network Error";
    mockedAxios.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useFetch("/test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(errorMessage);
  });

  it("should skip fetch when skip option is true", () => {
    const { result } = renderHook(() => useFetch("/test", { skip: true }));

    expect(result.current.loading).toBe(false);
    expect(mockedAxios).not.toHaveBeenCalled();
  });

  it("should refetch data manually", async () => {
    const mockData = { id: 1, name: "Test" };
    mockedAxios.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useFetch("/test", { skip: true }));

    expect(mockedAxios).not.toHaveBeenCalled();

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedAxios).toHaveBeenCalledTimes(1);
  });
});
