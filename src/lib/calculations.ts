import { PriceData, VestingSchedule, VestingEvent } from "@/types";
import { VESTING_CONFIG, TERM_6_DATES, UI_CONFIG } from "./constants";
import { addMonths, format, parseISO } from "date-fns";

/**
 * Calculate the 6-month average price from price data
 */
export function calculateSixMonthAverage(prices: PriceData[]): number {
  if (!prices || prices.length === 0) return 0;

  const validPrices = prices.filter((p) => p.price > 0);
  if (validPrices.length === 0) return 0;

  const sum = validPrices.reduce((acc, p) => acc + p.price, 0);
  return sum / validPrices.length;
}

/**
 * Calculate token allocation based on annual compensation and average price
 */
export function calculateTokenAllocation(
  annualCompensation: number,
  averagePrice: number
): number {
  if (averagePrice <= 0) return 0;
  return annualCompensation / averagePrice;
}

/**
 * Generate a complete vesting schedule for a steward
 */
export function generateVestingSchedule(
  totalTokens: number,
  startDate: string = TERM_6_DATES.VESTING_START,
  distributionDate: string = TERM_6_DATES.DISTRIBUTION_DATE,
  endDate: string = TERM_6_DATES.VESTING_END
): VestingSchedule {
  const schedule: VestingEvent[] = [];

  // Calculate monthly vesting amount
  const monthlyVesting = totalTokens / VESTING_CONFIG.TOTAL_DURATION_MONTHS;

  // Tokens vested at distribution (25% after 6 months)
  const tokensAtDistribution =
    totalTokens * VESTING_CONFIG.TOKENS_VESTED_AT_DISTRIBUTION;

  // Add vesting start event
  schedule.push({
    date: startDate,
    tokens: 0,
    percentage: 0,
    type: "start",
  });

  // Generate monthly vesting events
  const start = parseISO(startDate);
  for (let month = 1; month <= VESTING_CONFIG.TOTAL_DURATION_MONTHS; month++) {
    const vestingDate = addMonths(start, month);
    const tokensVested = monthlyVesting * month;
    const percentage = (tokensVested / totalTokens) * 100;

    // Special handling for distribution date
    const isDistributionMonth =
      format(vestingDate, "yyyy-MM-dd") === distributionDate;

    schedule.push({
      date: format(vestingDate, "yyyy-MM-dd"),
      tokens: monthlyVesting,
      percentage: percentage,
      type: isDistributionMonth ? "distribution" : "monthly",
    });
  }

  // Add vesting end event
  schedule.push({
    date: endDate,
    tokens: 0,
    percentage: 100,
    type: "end",
  });

  return {
    startDate,
    distributionDate,
    endDate,
    totalTokens,
    tokensAtDistribution,
    monthlyVesting,
    schedule,
  };
}

/**
 * Calculate how many tokens are available at a specific date
 */
export function calculateTokensAvailableAtDate(
  vestingSchedule: VestingSchedule,
  targetDate: Date
): number {
  const targetDateStr = format(targetDate, "yyyy-MM-dd");
  const distributionDateStr = vestingSchedule.distributionDate;

  // If before distribution date, no tokens are available
  if (targetDateStr < distributionDateStr) {
    return 0;
  }

  // Find the last vesting event before or on the target date
  let availableTokens = 0;
  for (const event of vestingSchedule.schedule) {
    if (event.date <= targetDateStr && event.type === "monthly") {
      availableTokens += event.tokens;
    }
  }

  return availableTokens;
}

/**
 * Calculate vesting progress as a percentage
 */
export function calculateVestingProgress(
  vestingSchedule: VestingSchedule,
  currentDate: Date = new Date()
): number {
  const current = format(currentDate, "yyyy-MM-dd");
  const start = vestingSchedule.startDate;
  const end = vestingSchedule.endDate;

  if (current < start) return 0;
  if (current >= end) return 100;

  // Calculate progress based on time elapsed
  const startTime = parseISO(start).getTime();
  const endTime = parseISO(end).getTime();
  const currentTime = currentDate.getTime();

  const progress = ((currentTime - startTime) / (endTime - startTime)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(
  amount: number,
  decimals: number = UI_CONFIG.PRICE_DECIMALS
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format a number as tokens with proper decimals
 */
export function formatTokens(
  amount: number,
  decimals: number = UI_CONFIG.TOKEN_DECIMALS
): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format a percentage with proper decimals
 */
export function formatPercentage(
  percentage: number,
  decimals: number = UI_CONFIG.PERCENTAGE_DECIMALS
): string {
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Get the next vesting milestone for display purposes
 */
export function getNextVestingMilestone(
  vestingSchedule: VestingSchedule,
  currentDate: Date = new Date()
): VestingEvent | null {
  const currentDateStr = format(currentDate, "yyyy-MM-dd");

  for (const event of vestingSchedule.schedule) {
    if (
      event.date > currentDateStr &&
      (event.type === "distribution" || event.type === "end")
    ) {
      return event;
    }
  }

  return null;
}

/**
 * Calculate the difference between two prices as a percentage
 */
export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): number {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

/**
 * Validate that a price is reasonable (not negative, not extremely high)
 */
export function isValidPrice(price: number): boolean {
  return !isNaN(price) && price > 0 && price < 1000000; // Max $1M per token seems reasonable
}

/**
 * Convert timestamp to date string
 */
export function timestampToDateString(timestamp: number): string {
  return format(new Date(timestamp), "yyyy-MM-dd");
}
