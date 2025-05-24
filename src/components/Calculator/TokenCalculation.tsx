"use client";

import { TokenCalculationProps } from "@/types";
import {
  formatCurrency,
  formatTokens,
  formatPercentage,
} from "@/lib/calculations";

interface TokenCalculationPropsWithRole
  extends Omit<TokenCalculationProps, "role"> {
  selectedRole: "steward" | "lead_steward";
  onRoleChange: (role: "steward" | "lead_steward") => void;
  role: TokenCalculationProps["role"];
  averagePrice: number;
  vestingSchedule: TokenCalculationProps["vestingSchedule"];
}

export function TokenCalculation({
  selectedRole,
  onRoleChange,
  role,
  averagePrice,
  vestingSchedule,
}: TokenCalculationPropsWithRole) {
  const totalTokens = vestingSchedule.totalTokens;
  const tokensAtDistribution = vestingSchedule.tokensAtDistribution;
  const distributionPercentage = (tokensAtDistribution / totalTokens) * 100;
  const currentValue = totalTokens * averagePrice;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header with Role Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Token Allocation
        </h2>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onRoleChange("steward")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedRole === "steward"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Steward
          </button>
          <button
            onClick={() => onRoleChange("lead_steward")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedRole === "lead_steward"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Lead Steward
          </button>
        </div>
      </div>

      {/* Role Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{role.name}</h3>
            <p className="text-sm text-gray-600">{role.description}</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-semibold text-gray-900">
              {formatCurrency(role.annualCompensation, 0)}
            </div>
            <div className="text-xs text-gray-500">per year</div>
          </div>
        </div>
      </div>

      {/* Token Allocation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            Total Token Allocation
          </h3>
          <p className="text-2xl font-bold text-blue-900">
            {formatTokens(totalTokens)} $ENS
          </p>
          <p className="text-sm text-blue-600">
            Based on {formatCurrency(averagePrice)} average
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-1">
            Available at Distribution
          </h3>
          <p className="text-2xl font-bold text-green-900">
            {formatTokens(tokensAtDistribution)} $ENS
          </p>
          <p className="text-sm text-green-600">
            {formatPercentage(distributionPercentage)} on July 1, 2025
          </p>
        </div>
      </div>

      {/* Current Value & Monthly Vesting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 mb-1">
            Current Total Value
          </h3>
          <p className="text-2xl font-bold text-purple-900">
            {formatCurrency(currentValue)}
          </p>
          <p className="text-sm text-purple-600">At current ENS price</p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <h3 className="text-sm font-medium text-orange-800 mb-1">
            Monthly Vesting
          </h3>
          <p className="text-2xl font-bold text-orange-900">
            {formatTokens(vestingSchedule.monthlyVesting)} $ENS
          </p>
          <p className="text-sm text-orange-600">
            For 24 months after distribution
          </p>
        </div>
      </div>

      {/* Vesting Timeline Summary */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Vesting Timeline
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Vesting Start:</span>
            <span className="font-medium">January 1, 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Token Distribution:</span>
            <span className="font-medium">
              July 1, 2025 ({formatPercentage(distributionPercentage)} vested)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Full Vesting:</span>
            <span className="font-medium">January 1, 2027</span>
          </div>
        </div>
      </div>

      {/* Calculation Details */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-700 mb-3">Calculation Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium">{role.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Annual Compensation:</span>
            <span className="font-mono font-medium">
              {formatCurrency(role.annualCompensation, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">6-Month Average Price:</span>
            <span className="font-mono font-medium">
              {formatCurrency(averagePrice)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600 font-medium">Total Tokens:</span>
            <span className="font-mono font-semibold">
              {formatTokens(totalTokens)} $ENS
            </span>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start">
          <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 mt-0.5 flex-shrink-0"></div>
          <div className="text-xs text-yellow-800">
            <strong>Important:</strong> This calculation is based on projected
            prices. Final token amounts will be determined using the actual
            6-month average price from January 1 to July 1, 2025. Tokens vest
            linearly over 2 years starting January 1, 2025.
          </div>
        </div>
      </div>
    </div>
  );
}
