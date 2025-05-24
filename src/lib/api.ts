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

    const price = data.ethereum_name_service?.usd;
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
 * Calculate 6-month average price (mock implementation for development)
 * In production, this would use actual historical data from the 6-month period
 */
export async function calculateProjectedSixMonthAverage(): Promise<number> {
  const cacheKey = "projected_six_month_average";
  const cached = cache.get<number>(cacheKey);

  if (cached !== null) {
    return cached;
  }

  try {
    // For now, we'll use recent price data as a projection
    // In production, this would be replaced with actual Jan 1 - July 1, 2025 data
    const priceHistory = await fetchENSPriceHistory(180); // 6 months of data

    if (priceHistory.length === 0) {
      return DEFAULTS.MOCK_AVERAGE_PRICE;
    }

    const sum = priceHistory.reduce((acc, p) => acc + p.price, 0);
    const average = sum / priceHistory.length;

    cache.set(cacheKey, average);
    return average;
  } catch (error) {
    console.error("Error calculating projected average:", error);
    return DEFAULTS.MOCK_AVERAGE_PRICE;
  }
}

/**
 * Fallback function to provide mock data when API fails
 */
function createFallbackPriceHistory(currentPrice?: number): PriceHistory {
  const mockCurrentPrice = currentPrice || DEFAULTS.FALLBACK_ENS_PRICE;
  const mockAveragePrice = DEFAULTS.MOCK_AVERAGE_PRICE;

  // Generate mock historical data (last 180 days)
  const mockPrices: PriceData[] = [];
  const today = new Date();

  for (let i = 179; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic price variation around the mock average
    const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
    const price = mockAveragePrice * (1 + variation);

    mockPrices.push({
      date: date.toISOString().split("T")[0],
      price,
      timestamp: date.getTime(),
    });
  }

  console.log(
    `[API] Using fallback data - Current: $${mockCurrentPrice}, Average: $${mockAveragePrice}`
  );

  return {
    prices: mockPrices,
    averagePrice: mockAveragePrice,
    currentPrice: mockCurrentPrice,
    lastUpdated: Date.now(),
  };
}

/**
 * Fetch complete price history for the calculator with fallback
 */
export async function fetchPriceHistoryForCalculator(): Promise<PriceHistory> {
  try {
    console.log("[API] Attempting to fetch real price data...");

    const [currentPrice, priceHistory, averagePrice] = await Promise.all([
      fetchCurrentENSPrice(),
      fetchENSPriceHistory(180),
      calculateProjectedSixMonthAverage(),
    ]);

    console.log("[API] Successfully fetched real price data");

    return {
      prices: priceHistory,
      averagePrice,
      currentPrice,
      lastUpdated: Date.now(),
    };
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
    return createFallbackPriceHistory(fallbackCurrentPrice);
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
