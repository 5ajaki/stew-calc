import { NextRequest, NextResponse } from "next/server";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const ENS_COIN_ID = "ethereum-name-service";

// Simple server-side cache
const cache = new Map<string, { data: unknown; expiry: number }>();

function isValidPrice(price: number): boolean {
  return !isNaN(price) && price > 0 && price < 1000000;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "current";

  try {
    // Check cache first
    const cacheKey = `ens-${type}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      console.log(`[API Route] Returning cached data for ${type}`);
      return NextResponse.json(cached.data);
    }

    let apiUrl: string;
    const apiKey =
      process.env.NEXT_PUBLIC_COINGECKO_API_KEY ||
      process.env.COINGECKO_API_KEY;

    if (type === "current") {
      apiUrl = `${COINGECKO_BASE_URL}/simple/price?ids=${ENS_COIN_ID}&vs_currencies=usd&include_24hr_change=true`;
    } else if (type === "history") {
      const days = searchParams.get("days") || "180";
      apiUrl = `${COINGECKO_BASE_URL}/coins/${ENS_COIN_ID}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }

    // Add API key if available
    if (apiKey) {
      const url = new URL(apiUrl);
      url.searchParams.set("x_cg_demo_api_key", apiKey);
      apiUrl = url.toString();
    }

    console.log(`[API Route] Fetching ${type} data from CoinGecko`);

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ENS-Steward-Calculator/1.0",
      },
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the data
    if (type === "current") {
      const price = data.ethereum_name_service?.usd;
      if (!price || !isValidPrice(price)) {
        throw new Error("Invalid price data received");
      }
    } else if (type === "history") {
      if (!data.prices || !Array.isArray(data.prices)) {
        throw new Error("Invalid history data received");
      }
    }

    // Cache the result for 15 minutes
    cache.set(cacheKey, {
      data,
      expiry: Date.now() + 15 * 60 * 1000,
    });

    console.log(`[API Route] Successfully fetched and cached ${type} data`);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[API Route] Error fetching ${type} data:`, error);

    // Return fallback data for current price
    if (type === "current") {
      const fallbackData = {
        ethereum_name_service: { usd: 12.0 }, // Fallback price
        _fallback: true,
      };
      return NextResponse.json(fallbackData);
    }

    // Return error for other types
    return NextResponse.json(
      {
        error: "Failed to fetch price data",
        details: error instanceof Error ? error.message : "Unknown error",
        _fallback: type === "current",
      },
      { status: 500 }
    );
  }
}
