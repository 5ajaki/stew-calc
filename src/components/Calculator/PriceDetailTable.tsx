"use client";

import { useState } from "react";
import { PriceHistory, PriceData } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import { format, parseISO } from "date-fns";

interface PriceDetailTableProps {
  priceHistory: PriceHistory;
}

export function PriceDetailTable({ priceHistory }: PriceDetailTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (!priceHistory.calculationPeriod) {
    return null;
  }

  const { calculationPeriod } = priceHistory;
  const sortedPrices = [...priceHistory.prices].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
  });

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

  // Calculate running average
  const calculateRunningAverage = (index: number): number => {
    const relevantPrices = sortedPrices.slice(0, index + 1);
    const sum = relevantPrices.reduce((acc, p) => acc + p.price, 0);
    return sum / relevantPrices.length;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header with toggle button */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Term 6 Price Calculation Details
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              January 1 - July 1, 2025 ({calculationPeriod.totalDays} days
              total)
            </p>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isOpen ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-800">Historical Days</div>
            <div className="text-green-600">
              {calculationPeriod.historicalDays}
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-800">Projected Days</div>
            <div className="text-blue-600">
              {calculationPeriod.projectedDays}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-800">6-Month Average</div>
            <div className="text-gray-600">
              {formatCurrency(priceHistory.averagePrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable table */}
      {isOpen && (
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>
                  Historical Data ({calculationPeriod.historicalDays} days)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>
                  Projected Data ({calculationPeriod.projectedDays} days)
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={toggleSort}
                  >
                    Date {sortOrder === "asc" ? "↑" : "↓"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (USD)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Running Avg
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPrices.map((priceData: PriceData, index: number) => {
                  const isProjected = priceData.isProjected || false;
                  const runningAvg = calculateRunningAverage(index);

                  return (
                    <tr
                      key={priceData.date}
                      className={`hover:bg-gray-50 ${
                        isProjected
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "bg-green-50 border-l-4 border-green-500"
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(priceData.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                        <span
                          className={
                            isProjected ? "text-blue-800" : "text-green-800"
                          }
                        >
                          {formatCurrency(priceData.price)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600">
                        {formatCurrency(runningAvg)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isProjected
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
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

          <div className="mt-4 text-xs text-gray-500">
            <p>
              <strong>Historical Data:</strong> Actual ENS prices from CoinGecko
              API
            </p>
            <p>
              <strong>Projected Data:</strong> Assumes price remains at current
              level (${formatCurrency(priceHistory.currentPrice)}) through July
              1, 2025
            </p>
            <p className="mt-2">
              As days progress, more data becomes historical and fewer days
              remain projected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
