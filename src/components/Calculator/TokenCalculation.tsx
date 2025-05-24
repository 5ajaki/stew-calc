"use client";

import { TokenCalculationProps } from "@/types";
import {
  formatCurrency,
  formatTokens,
  formatPercentage,
} from "@/lib/calculations";
import { TERM_6_DATES, VESTING_CONFIG } from "@/lib/constants";
import { format, parseISO } from "date-fns";

export function TokenCalculation({
  role,
  averagePrice,
  vestingSchedule,
}: TokenCalculationProps) {
  const totalTokens = vestingSchedule.totalTokens;
  const tokensAtDistribution = vestingSchedule.tokensAtDistribution;
  const remainingTokens = totalTokens - tokensAtDistribution;

  // Calculate some key dates
  const distributionDate = format(
    parseISO(TERM_6_DATES.DISTRIBUTION_DATE),
    "MMM dd, yyyy"
  );
  const vestingEndDate = format(
    parseISO(TERM_6_DATES.VESTING_END),
    "MMM dd, yyyy"
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Token Allocation
        </h2>
        <p className="text-sm text-gray-600">
          Your $ENS token allocation for {role.name} role
        </p>
      </div>

      <div className="space-y-4">
        {/* Total Token Allocation */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">
                Total Token Allocation
              </h3>
              <div className="font-mono text-3xl font-bold text-green-600">
                {formatTokens(totalTokens)} $ENS
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Calculated from</div>
              <div className="font-mono text-sm font-medium">
                {formatCurrency(role.annualCompensation, 0)} ÷{" "}
                {formatCurrency(averagePrice)}
              </div>
            </div>
          </div>
        </div>

        {/* Vesting Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Available at Distribution */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Available on {distributionDate}
            </h3>
            <div className="font-mono text-xl font-bold text-blue-600 mb-1">
              {formatTokens(tokensAtDistribution)} $ENS
            </div>
            <div className="text-sm text-gray-600">
              {formatPercentage(
                VESTING_CONFIG.TOKENS_VESTED_AT_DISTRIBUTION * 100
              )}{" "}
              already vested
            </div>
          </div>

          {/* Remaining Vesting */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Remaining Vesting
            </h3>
            <div className="font-mono text-xl font-bold text-purple-600 mb-1">
              {formatTokens(remainingTokens)} $ENS
            </div>
            <div className="text-sm text-gray-600">Until {vestingEndDate}</div>
          </div>
        </div>

        {/* Monthly Vesting */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">
                Monthly Vesting
              </h3>
              <div className="font-mono text-lg font-semibold text-gray-800">
                {formatTokens(vestingSchedule.monthlyVesting)} $ENS
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">per month</div>
              <div className="text-xs text-gray-500">for 24 months</div>
            </div>
          </div>
        </div>

        {/* Calculation Details */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-3">
            Calculation Details
          </h3>
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
    </div>
  );
}
