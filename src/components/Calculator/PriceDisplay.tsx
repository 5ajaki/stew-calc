"use client";

import { useState } from "react";
import { PriceDisplayProps, PriceData } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import { format, parseISO } from "date-fns";

export function PriceDisplay({
  priceHistory,
  loading,
  error,
}: PriceDisplayProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          $ENS Price Data
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-400 dark:bg-red-500 rounded-full mr-2"></div>
            <div className="text-sm text-red-800 dark:text-red-200">
              Error loading price data: {error.message}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!priceHistory) {
    return null;
  }

  const { calculationPeriod } = priceHistory;

  // Functions for the detailed table
  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const calculateRunningAverage = (
    prices: PriceData[],
    index: number
  ): number => {
    const relevantPrices = prices.slice(0, index + 1);
    const sum = relevantPrices.reduce((acc, p) => acc + p.price, 0);
    return sum / relevantPrices.length;
  };

  const sortedPrices = calculationPeriod
    ? [...priceHistory.prices].sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      })
    : [];

  // CSV download function
  const downloadCSV = () => {
    if (!calculationPeriod) return;

    const headers = ["Date", "Price (USD)", "Running Average", "Type"];
    const csvContent = [
      headers.join(","),
      ...sortedPrices.map((priceData: PriceData, index: number) => {
        const isProjected = priceData.isProjected || false;
        const runningAvg = calculateRunningAverage(sortedPrices, index);

        return [
          priceData.date,
          priceData.price.toFixed(4),
          runningAvg.toFixed(4),
          isProjected ? "Projected" : "Historical",
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ens-term6-price-data-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        $ENS Price Data
      </h2>

      {/* Current Price Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
            Current Price
          </h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formatCurrency(priceHistory.currentPrice)}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Real-time from CoinGecko
          </p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
            6-Month Average
          </h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formatCurrency(priceHistory.averagePrice)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Jan 1 - July 1, 2025
          </p>
        </div>
      </div>

      {/* Term 6 Calculation Details Section */}
      {calculationPeriod && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Term 6 Price Calculation Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                January 1 - July 1, 2025 ({calculationPeriod.totalDays} days
                total)
              </p>
            </div>
            <div className="flex space-x-2">
              {isDetailOpen && (
                <button
                  onClick={downloadCSV}
                  className="px-3 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm flex items-center"
                  title="Download price data as CSV"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  CSV
                </button>
              )}
              <button
                onClick={() => setIsDetailOpen(!isDetailOpen)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                {isDetailOpen ? "Hide Details" : "Show Details"}
              </button>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="font-semibold text-green-800 dark:text-green-200">
                Historical Days
              </div>
              <div className="text-green-600 dark:text-green-400">
                {calculationPeriod.historicalDays}
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="font-semibold text-blue-800 dark:text-blue-200">
                Projected Days
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                {calculationPeriod.projectedDays}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                Average Price
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {formatCurrency(priceHistory.averagePrice)}
              </div>
            </div>
          </div>

          {/* Expandable detailed table */}
          {isDetailOpen && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Historical Data ({calculationPeriod.historicalDays} days)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Projected Data ({calculationPeriod.projectedDays} days)
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto max-h-96 border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={toggleSort}
                      >
                        Date {sortOrder === "asc" ? "↑" : "↓"}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price (USD)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Running Avg
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedPrices.map((priceData: PriceData, index: number) => {
                      const isProjected = priceData.isProjected || false;
                      const runningAvg = calculateRunningAverage(
                        sortedPrices,
                        index
                      );

                      return (
                        <tr
                          key={priceData.date}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            isProjected
                              ? "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 dark:border-blue-400"
                              : "bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 dark:border-green-400"
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(priceData.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                            <span
                              className={
                                isProjected
                                  ? "text-blue-800 dark:text-blue-200"
                                  : "text-green-800 dark:text-green-200"
                              }
                            >
                              {formatCurrency(priceData.price)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                            {formatCurrency(runningAvg)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isProjected
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                                  : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
                              }`}
                            >
                              {isProjected ? "Projected" : "Historical"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">
                    Historical Data:
                  </strong>{" "}
                  Actual ENS prices from CoinGecko API
                </p>
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">
                    Projected Data:
                  </strong>{" "}
                  Assumes price remains at current level (
                  {formatCurrency(priceHistory.currentPrice)}) through July 1,
                  2025
                </p>
                <p className="mt-2">
                  As days progress, more data becomes historical and fewer days
                  remain projected.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data source info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <p>
          Data source: CoinGecko API • Last updated:{" "}
          {new Date(priceHistory.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
