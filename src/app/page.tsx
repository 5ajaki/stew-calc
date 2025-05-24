"use client";

import { useState, useMemo } from "react";
import { RoleSelector } from "@/components/Calculator/RoleSelector";
import { PriceDisplay } from "@/components/Calculator/PriceDisplay";
import { TokenCalculation } from "@/components/Calculator/TokenCalculation";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ENS Steward Token Calculator
            </h1>
            <p className="mt-2 text-gray-600">
              Calculate your $ENS token allocation for ENS DAO Term 6 steward
              compensation
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Role Selector */}
            <RoleSelector
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />

            {/* Price Display */}
            <PriceDisplay
              priceHistory={priceHistory}
              loading={loading}
              error={error}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Token Calculation */}
            {tokenData ? (
              <TokenCalculation
                role={tokenData.role}
                averagePrice={tokenData.averagePrice}
                vestingSchedule={tokenData.vestingSchedule}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Information Panel */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About ENS Steward Compensation
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Term 6 Structure:</strong> Stewards receive $ENS
                  tokens equal in value to their total USDC compensation for the
                  year.
                </p>
                <p>
                  <strong>Price Calculation:</strong> Token amount is calculated
                  using a 6-month average price from January 1st to July 1st,
                  2025.
                </p>
                <p>
                  <strong>Vesting Schedule:</strong> 2-year linear vesting
                  starting January 1, 2025. Tokens are distributed on July 1,
                  2025, with 25% already vested.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Based on{" "}
                  <a
                    href="https://discuss.ens.domains/t/ens-dao-steward-compensation-structure-term-6/19739"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
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
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-800 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            This is an educational tool for transparency. Official compensation
            decisions are governed by ENS DAO governance processes.
          </div>
        </div>
      </main>
    </div>
  );
}
