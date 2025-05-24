import {
  PriceData,
  PriceHistory,
  CoinGeckoPrice,
  CoinGeckoMarketChart,
  AppError,
  ErrorType,
  CacheEntry,
} from "@/types";
import { API_CONFIG, ERROR_MESSAGES, DEFAULTS } from "./constants";
import { isValidPrice, timestampToDateString } from "./calculations";

// Simple in-memory cache
class APICache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttl: number = API_CONFIG.CACHE_TTL_MS): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    };
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new APICache();

/**
 * Create API error with proper typing
 */
function createAPIError(
  type: ErrorType,
  message: string,
  details?: unknown
): AppError {
  return {
    type,
    message,
    details,
    timestamp: Date.now(),
  };
}

/**
 * Fetch current ENS price from our API route
 */
export async function fetchCurrentENSPrice(): Promise<number> {
  const cacheKey = "current_ens_price";
  const cached = cache.get<number>(cacheKey);

  if (cached !== null) {
    return cached;
  }

  try {
    console.log("[API] Fetching current price from API route");

    const response = await fetch("/api/ens-price?type=current", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw createAPIError(
        ErrorType.API_ERROR,
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data: CoinGeckoPrice & { _fallback?: boolean } =
      await response.json();

    const price = data["ethereum-name-service"]?.usd;
    if (!price || !isValidPrice(price)) {
      throw createAPIError(ErrorType.INVALID_DATA, ERROR_MESSAGES.INVALID_DATA);
    }

    // Log if using fallback data
    if (data._fallback) {
      console.warn("[API] Using fallback price data");
    }

    cache.set(cacheKey, price);
    return price;
  } catch (error) {
    console.error("Error fetching current ENS price:", error);

    // Return cached data if available, otherwise fallback
    const staleData = cache.get<number>(cacheKey);
    if (staleData !== null) {
      return staleData;
    }

    throw error;
  }
}

/**
 * Fetch historical ENS price data from our API route
 */
export async function fetchENSPriceHistory(
  days: number = 180,
  interval: string = "daily"
): Promise<PriceData[]> {
  const cacheKey = `ens_price_history_${days}_${interval}`;
  const cached = cache.get<PriceData[]>(cacheKey);

  if (cached !== null) {
    return cached;
  }

  try {
    console.log("[API] Fetching price history from API route");

    const response = await fetch(`/api/ens-price?type=history&days=${days}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw createAPIError(
        ErrorType.API_ERROR,
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data: CoinGeckoMarketChart = await response.json();

    if (!data.prices || !Array.isArray(data.prices)) {
      throw createAPIError(ErrorType.INVALID_DATA, ERROR_MESSAGES.INVALID_DATA);
    }

    const priceData: PriceData[] = data.prices
      .map(([timestamp, price]) => ({
        date: timestampToDateString(timestamp),
        price,
        timestamp,
      }))
      .filter((p) => isValidPrice(p.price));

    if (priceData.length === 0) {
      throw createAPIError(ErrorType.INVALID_DATA, ERROR_MESSAGES.NO_DATA);
    }

    cache.set(cacheKey, priceData);
    return priceData;
  } catch (error) {
    console.error("Error fetching ENS price history:", error);

    // Return cached data if available
    const staleData = cache.get<PriceData[]>(cacheKey);
    if (staleData !== null) {
      return staleData;
    }

    throw error;
  }
}

/**
 * Calculate 6-month average price for Term 6 (Jan 1 - July 1, 2025)
 * Uses actual historical data from Jan 1 to today, then projects current price forward
 */
export async function calculateProjectedSixMonthAverage(): Promise<PriceHistory> {
  const cacheKey = "term6_price_history";
  const cached = cache.get<PriceHistory>(cacheKey);

  if (cached !== null) {
    return cached;
  }

  try {
    console.log(
      "[API] Calculating Term 6 price average (Jan 1 - July 1, 2025)"
    );

    // Get current price for projections
    const currentPrice = await fetchCurrentENSPrice();

    // Term 6 calculation period: Jan 1, 2025 to July 1, 2025 (181 days)
    const startDate = new Date("2025-01-01T00:00:00.000Z"); // Use UTC to avoid timezone issues
    const endDate = new Date("2025-07-01T00:00:00.000Z");
    const today = new Date();

    // Calculate days from start to today and total days
    const daysFromStart = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalDays =
      Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1; // 181 days

    console.log(
      `[API] Term 6 period: ${totalDays} days total, days from start: ${daysFromStart} (today: ${
        today.toISOString().split("T")[0]
      })`
    );

    let historicalPrices: PriceData[] = [];

    // Only fetch historical data if we're past Jan 1, 2025
    if (daysFromStart > 0) {
      try {
        // Fetch more historical data than we need to ensure we have coverage
        // CoinGecko returns data going backwards from today, so we need extra buffer
        const daysToFetch = Math.min(daysFromStart + 7, 365); // Add 7-day buffer, max 365 days
        console.log(
          `[API] Fetching ${daysToFetch} days of historical data (with buffer)`
        );
        historicalPrices = await fetchENSPriceHistory(daysToFetch);

        // Filter to ensure we only get data from Jan 1, 2025 onwards
        // Create a precise cutoff at start of January 1, 2025 UTC
        const jan1_2025_cutoff = startDate.getTime();

        const beforeFilter = historicalPrices.length;
        historicalPrices = historicalPrices.filter((p) => {
          // Ensure the timestamp is at or after January 1, 2025 00:00:00 UTC
          return p.timestamp >= jan1_2025_cutoff;
        });

        console.log(
          `[API] Filtered historical data: ${beforeFilter} -> ${
            historicalPrices.length
          } entries (removed ${
            beforeFilter - historicalPrices.length
          } pre-Jan-1 entries)`
        );

        // Additional safety check: log the date range of filtered data
        if (historicalPrices.length > 0) {
          const firstDate = historicalPrices[0].date;
          const lastDate = historicalPrices[historicalPrices.length - 1].date;
          console.log(
            `[API] Historical data range: ${firstDate} to ${lastDate}`
          );
        }
      } catch {
        console.warn(
          "[API] Could not fetch historical data, using current price for all days"
        );
        historicalPrices = [];
      }
    } else {
      console.log(
        `[API] Before Term 6 start date - all data will be projected using current price`
      );
    }

    // Generate complete 181-day price dataset
    const completePriceData: PriceData[] = [];

    for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
      const date = new Date(startDate);
      date.setUTCDate(date.getUTCDate() + dayOffset); // Use UTC to avoid timezone issues
      const dateStr = timestampToDateString(date.getTime());

      // Use historical data if available, otherwise project current price
      const historicalDay = historicalPrices.find((p) => p.date === dateStr);
      const price = historicalDay ? historicalDay.price : currentPrice;
      const isProjected = !historicalDay;

      completePriceData.push({
        date: dateStr,
        price,
        timestamp: date.getTime(),
        isProjected, // Add flag to track projected vs historical
      });
    }

    // Calculate the average over all 181 days
    const totalSum = completePriceData.reduce((sum, p) => sum + p.price, 0);
    const averagePrice = totalSum / completePriceData.length;

    const historicalDays = completePriceData.filter(
      (p) => !p.isProjected
    ).length;
    const projectedDays = completePriceData.length - historicalDays;

    console.log(
      `[API] Term 6 Average: $${averagePrice.toFixed(
        4
      )} (${historicalDays} historical + ${projectedDays} projected days)`
    );

    // Verify first entry is January 1, 2025
    if (completePriceData.length > 0) {
      console.log(
        `[API] First entry date: ${completePriceData[0].date} (should be 2025-01-01)`
      );
    }

    const result: PriceHistory = {
      prices: completePriceData,
      averagePrice,
      currentPrice,
      lastUpdated: Date.now(),
      calculationPeriod: {
        startDate: "2025-01-01",
        endDate: "2025-07-01",
        totalDays,
        historicalDays,
        projectedDays,
      },
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error calculating Term 6 average:", error);

    // Fallback: create projected data using current or fallback price
    const fallbackPrice = DEFAULTS.FALLBACK_ENS_PRICE;
    return createTerm6FallbackData(fallbackPrice);
  }
}

/**
 * Create fallback Term 6 data when API fails
 */
function createTerm6FallbackData(price: number): PriceHistory {
  const startDate = new Date("2025-01-01");
  const endDate = new Date("2025-07-01");
  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const prices: PriceData[] = [];
  for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);

    prices.push({
      date: timestampToDateString(date.getTime()),
      price,
      timestamp: date.getTime(),
      isProjected: true,
    });
  }

  console.log(
    `[API] Using fallback Term 6 data with $${price} for all ${totalDays} days`
  );

  return {
    prices,
    averagePrice: price,
    currentPrice: price,
    lastUpdated: Date.now(),
    calculationPeriod: {
      startDate: "2025-01-01",
      endDate: "2025-07-01",
      totalDays,
      historicalDays: 0,
      projectedDays: totalDays,
    },
  };
}

/**
 * Fetch complete price history for the calculator with fallback
 */
export async function fetchPriceHistoryForCalculator(): Promise<PriceHistory> {
  try {
    console.log("[API] Fetching Term 6 price history and calculations...");

    // The new calculateProjectedSixMonthAverage now returns complete PriceHistory
    const priceHistory = await calculateProjectedSixMonthAverage();

    console.log("[API] Successfully calculated Term 6 price data");
    return priceHistory;
  } catch (error) {
    console.error("Error fetching price history for calculator:", error);

    // Try to get cached current price for fallback
    let fallbackCurrentPrice: number = DEFAULTS.FALLBACK_ENS_PRICE;
    const cached = cache.get<number>("current_ens_price");
    if (cached) {
      fallbackCurrentPrice = cached;
      console.log("[API] Using cached price for fallback");
    } else {
      console.log("[API] No cached price available, using default");
    }

    // Return fallback data instead of throwing
    console.warn("[API] API failed, returning fallback data");
    return createTerm6FallbackData(fallbackCurrentPrice);
  }
}

/**
 * Clear all cached data (useful for testing)
 */
export function clearAPICache(): void {
  cache.clear();
}

/**
 * Check if API is reachable
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    await fetchCurrentENSPrice();
    return true;
  } catch {
    return false;
  }
}
