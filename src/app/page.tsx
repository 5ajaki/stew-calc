"use client";

import { useState, useMemo } from "react";
import { PriceDisplay } from "@/components/Calculator/PriceDisplay";
import { TokenCalculation } from "@/components/Calculator/TokenCalculation";
import { ThemeToggle } from "@/components/UI/ThemeToggle";
import { usePriceData } from "@/hooks/usePriceData";
import { STEWARD_ROLES, DEFAULTS } from "@/lib/constants";
import {
  calculateTokenAllocation,
  generateVestingSchedule,
} from "@/lib/calculations";

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<"steward" | "lead_steward">(
    DEFAULTS.SELECTED_ROLE
  );
  const { priceHistory, loading, error } = usePriceData();

  // Calculate token allocation and vesting schedule
  const tokenData = useMemo(() => {
    if (!priceHistory) return null;

    const role = STEWARD_ROLES[selectedRole];
    const averagePrice = priceHistory.averagePrice;
    const totalTokens = calculateTokenAllocation(
      role.annualCompensation,
      averagePrice
    );
    const vestingSchedule = generateVestingSchedule(totalTokens);

    return {
      role,
      averagePrice,
      vestingSchedule,
    };
  }, [selectedRole, priceHistory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ENS Steward Token Calculator
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Calculate the $ENS token allocation for ENS DAO Term 6 steward
                compensation
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* GitHub Link Pill */}
              <a
                href="https://github.com/5ajaki/stew-calc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200 border border-gray-200 dark:border-gray-600"
              >
                {/* GitHub Icon */}
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Price Display with integrated details */}
            <PriceDisplay
              priceHistory={priceHistory}
              loading={loading}
              error={error}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Token Calculation with integrated role selector */}
            {tokenData ? (
              <TokenCalculation
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                role={tokenData.role}
                averagePrice={tokenData.averagePrice}
                vestingSchedule={tokenData.vestingSchedule}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Information Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                About ENS Steward Compensation
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    Term 6 Structure:
                  </strong>{" "}
                  Stewards receive $ENS tokens equal in value to their total
                  USDC compensation for the year.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    Price Calculation:
                  </strong>{" "}
                  Token amount is calculated using a 6-month average price from
                  January 1st to July 1st, 2025.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    Vesting Schedule:
                  </strong>{" "}
                  2-year linear vesting starting January 1, 2025. Tokens are
                  distributed on July 1, 2025, with 25% already vested.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  Based on{" "}
                  <a
                    href="https://discuss.ens.domains/t/ens-dao-steward-compensation-structure-term-6/19739"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    [EP 5.18] ENS DAO Steward Compensation Structure - Term 6
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm border border-blue-200 dark:border-blue-700">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2"></div>
            This is an educational tool for transparency. Official compensation
            decisions are governed by ENS DAO governance processes.
          </div>
        </div>
      </main>
    </div>
  );
}
