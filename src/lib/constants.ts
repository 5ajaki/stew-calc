import { StewardRole } from "@/types";

// Steward role definitions based on EP 5.18
export const STEWARD_ROLES: Record<string, StewardRole> = {
  steward: {
    id: "steward",
    name: "Steward",
    monthlyCompensation: 4000,
    annualCompensation: 48000,
    description: "Regular DAO Steward",
  },
  lead_steward: {
    id: "lead_steward",
    name: "Lead Steward",
    monthlyCompensation: 5500,
    annualCompensation: 66000,
    description: "Lead DAO Steward",
  },
} as const;

// Important dates for Term 6
export const TERM_6_DATES = {
  VESTING_START: "2025-01-01",
  DISTRIBUTION_DATE: "2025-07-01",
  VESTING_END: "2027-01-01",
  PRICE_CALCULATION_START: "2025-01-01",
  PRICE_CALCULATION_END: "2025-07-01",
} as const;

// Vesting configuration
export const VESTING_CONFIG = {
  TOTAL_DURATION_MONTHS: 24, // 2 years
  MONTHS_TO_DISTRIBUTION: 6, // 6 months from start to distribution
  TOKENS_VESTED_AT_DISTRIBUTION: 0.25, // 25% already vested
} as const;

// API configuration
export const API_CONFIG = {
  COINGECKO_BASE_URL: "https://api.coingecko.com/api/v3",
  ENS_COIN_ID: "ethereum-name-service",
  CACHE_TTL_MS: 15 * 60 * 1000, // 15 minutes
  REQUEST_TIMEOUT_MS: 10000, // 10 seconds
} as const;

// UI configuration
export const UI_CONFIG = {
  PRICE_DECIMALS: 2,
  TOKEN_DECIMALS: 2,
  PERCENTAGE_DECIMALS: 1,
  DATE_FORMAT: "MMM dd, yyyy",
  DATETIME_FORMAT: "MMM dd, yyyy 'at' h:mm a",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Unable to connect to price service. Please check your internet connection.",
  API_ERROR: "Error fetching price data. Please try again later.",
  RATE_LIMIT: "Too many requests. Please wait a moment before refreshing.",
  INVALID_DATA: "Invalid price data received. Using cached data if available.",
  NO_DATA: "No price data available. Please try again later.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  DATA_UPDATED: "Price data updated successfully",
  USING_CACHED_DATA: "Using cached price data",
} as const;

// Default values
export const DEFAULTS = {
  SELECTED_ROLE: "steward" as const,
  FALLBACK_ENS_PRICE: 10, // Fallback price if API fails
  MOCK_AVERAGE_PRICE: 12, // Mock price for development/projection
} as const;

// ENS token contract information
export const ENS_TOKEN = {
  CONTRACT_ADDRESS: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
  SYMBOL: "ENS",
  DECIMALS: 18,
  NAME: "Ethereum Name Service",
} as const;

// Chart configuration
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  MOBILE_HEIGHT: 200,
  COLORS: {
    PRIMARY: "#5298FF",
    SECONDARY: "#22C55E",
    ERROR: "#EF4444",
    GRID: "#E5E7EB",
    TEXT: "#374151",
  },
} as const;
