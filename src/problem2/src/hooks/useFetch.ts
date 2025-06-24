import { useState, useEffect } from "react";
import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchOptions extends AxiosRequestConfig {
  skip?: boolean;
}

export function useFetch<T = unknown>(
  endpoint: string,
  options: UseFetchOptions = {}
): UseFetchState<T> & { refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!options.skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const url = `${baseUrl}${endpoint}`;

      const response = await axios({
        url,
        ...options,
      });

      setData(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message ||
        "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.skip) {
      fetchData();
    }
  }, [endpoint, JSON.stringify(options)]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
