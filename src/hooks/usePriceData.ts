import { useState, useEffect, useCallback } from "react";
import { PriceHistory, AppError, ErrorType } from "@/types";
import { fetchPriceHistoryForCalculator } from "@/lib/api";
import { API_CONFIG } from "@/lib/constants";

interface UsePriceDataReturn {
  priceHistory: PriceHistory | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function usePriceData(): UsePriceDataReturn {
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPriceHistoryForCalculator();
      setPriceHistory(data);
    } catch (err) {
      console.error("Error fetching price data:", err);

      // Convert any error to AppError
      let appError: AppError;

      if (
        err &&
        typeof err === "object" &&
        "type" in err &&
        "message" in err &&
        "timestamp" in err
      ) {
        // It's already an AppError
        appError = err as AppError;
      } else {
        // Create a new AppError
        appError = {
          type: ErrorType.API_ERROR,
          message:
            err instanceof Error ? err.message : "Unknown error occurred",
          timestamp: Date.now(),
        };
      }

      setError(appError);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up automatic refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, API_CONFIG.CACHE_TTL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  const lastUpdated = priceHistory ? new Date(priceHistory.lastUpdated) : null;

  return {
    priceHistory,
    loading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
}
