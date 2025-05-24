// Core data types for ENS Steward Token Calculator

export interface StewardRole {
  id: "steward" | "lead_steward";
  name: string;
  monthlyCompensation: number; // USD
  annualCompensation: number; // USD
  description: string;
}

export interface PriceData {
  date: string; // ISO date string (YYYY-MM-DD)
  price: number; // USD price
  timestamp: number; // Unix timestamp
}

export interface PriceHistory {
  prices: PriceData[];
  averagePrice: number; // 6-month average
  currentPrice: number;
  lastUpdated: number; // Unix timestamp
}

export interface VestingEvent {
  date: string; // ISO date string
  tokens: number; // Tokens vested
  percentage: number; // Percentage of total
  type: "monthly" | "distribution" | "start" | "end";
}

export interface VestingSchedule {
  startDate: string; // '2025-01-01'
  distributionDate: string; // '2025-07-01'
  endDate: string; // '2027-01-01'
  totalTokens: number;
  tokensAtDistribution: number; // 25% already vested
  monthlyVesting: number; // Tokens per month
  schedule: VestingEvent[];
}

export interface TokenCalculation {
  role: StewardRole;
  averagePrice: number;
  totalTokens: number;
  vestingSchedule: VestingSchedule;
}

// API response types
export interface CoinGeckoPrice {
  ethereum_name_service: {
    usd: number;
  };
}

export interface CoinGeckoMarketChart {
  prices: [number, number][]; // [timestamp, price] tuples
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// Error handling
export enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  API_ERROR = "API_ERROR",
  RATE_LIMIT = "RATE_LIMIT",
  INVALID_DATA = "INVALID_DATA",
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
  timestamp: number;
}

// Component prop types
export interface RoleSelectorProps {
  selectedRole: "steward" | "lead_steward";
  onRoleChange: (role: "steward" | "lead_steward") => void;
}

export interface PriceDisplayProps {
  priceHistory: PriceHistory | null;
  loading: boolean;
  error: AppError | null;
}

export interface TokenCalculationProps {
  role: StewardRole;
  averagePrice: number;
  vestingSchedule: VestingSchedule;
}

export interface VestingVisualizationProps {
  vestingSchedule: VestingSchedule;
  currentDate: Date;
}
