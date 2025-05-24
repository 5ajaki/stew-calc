"use client";

import { PriceDisplayProps } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import { format } from "date-fns";

export function PriceDisplay({
  priceHistory,
  loading,
  error,
}: PriceDisplayProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Price Data Error
          </h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium mb-2">
            Unable to fetch price data
          </p>
          <p className="text-red-600 text-sm">{error.message}</p>
          <p className="text-red-500 text-xs mt-2">
            Error occurred at{" "}
            {format(new Date(error.timestamp), "MMM dd, yyyy h:mm a")}
          </p>
        </div>
      </div>
    );
  }

  if (!priceHistory) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No price data available</div>
          <div className="text-sm text-gray-500">
            Please try refreshing the page
          </div>
        </div>
      </div>
    );
  }

  const lastUpdated = format(
    new Date(priceHistory.lastUpdated),
    "MMM dd, yyyy h:mm a"
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          $ENS Price Data
        </h2>
        <p className="text-sm text-gray-600">
          Real-time pricing for token allocation calculations
        </p>
      </div>

      <div className="space-y-4">
        {/* Current Price */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Current Price</h3>
              <div className="font-mono text-2xl font-bold text-blue-600">
                {formatCurrency(priceHistory.currentPrice)}
              </div>
            </div>
            <div className="text-right">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-xs text-gray-500 mt-1">Live</div>
            </div>
          </div>
        </div>

        {/* Projected 6-Month Average */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">
                Projected 6-Month Average
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Estimate
                </span>
              </h3>
              <div className="font-mono text-2xl font-bold text-yellow-600">
                {formatCurrency(priceHistory.averagePrice)}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Based on current market data. Actual average will be calculated from
            Jan 1 - July 1, 2025.
          </div>
        </div>

        {/* Data Info */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Data points:</span>
            <span className="font-medium">
              {priceHistory.prices.length} days
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-500">Last updated:</span>
            <span className="font-medium">{lastUpdated}</span>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 mt-0.5 flex-shrink-0"></div>
            <div className="text-xs text-gray-600">
              <strong>Note:</strong> Token calculations use the 6-month average
              price from January 1 to July 1, 2025. Current projections are
              based on recent market data and will be updated with actual prices
              as dates approach.
            </div>
          </div>
        </div>

        {/* API Status Notice */}
        {priceHistory &&
          priceHistory.prices.length === 180 &&
          Math.abs(priceHistory.currentPrice - 10) < 0.01 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 mt-0.5 flex-shrink-0"></div>
                <div className="text-xs text-yellow-800">
                  <strong>Using Demo Data:</strong> Unable to connect to live
                  price API. Calculations are using fallback price data for
                  demonstration purposes.
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
