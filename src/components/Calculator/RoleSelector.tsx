"use client";

import { RoleSelectorProps } from "@/types";
import { STEWARD_ROLES } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculations";

export function RoleSelector({
  selectedRole,
  onRoleChange,
}: RoleSelectorProps) {
  const currentRole = STEWARD_ROLES[selectedRole];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Select Your Role
        </h2>
        <p className="text-sm text-gray-600">
          Choose your steward role to calculate your token allocation
        </p>
      </div>

      <div className="space-y-3">
        {/* Role Toggle Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onRoleChange("steward")}
            className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedRole === "steward"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Steward</h3>
                <p className="text-sm text-gray-600">Regular DAO Steward</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-semibold text-gray-900">
                  {formatCurrency(STEWARD_ROLES.steward.annualCompensation, 0)}
                </div>
                <div className="text-xs text-gray-500">per year</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onRoleChange("lead_steward")}
            className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedRole === "lead_steward"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Lead Steward</h3>
                <p className="text-sm text-gray-600">Lead DAO Steward</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-semibold text-gray-900">
                  {formatCurrency(
                    STEWARD_ROLES.lead_steward.annualCompensation,
                    0
                  )}
                </div>
                <div className="text-xs text-gray-500">per year</div>
              </div>
            </div>
          </button>
        </div>

        {/* Selected Role Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Selected Role:
            </span>
            <span className="font-semibold text-gray-900">
              {currentRole.name}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium text-gray-700">
              Monthly Compensation:
            </span>
            <span className="font-mono font-semibold text-blue-600">
              {formatCurrency(currentRole.monthlyCompensation, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium text-gray-700">
              Annual Compensation:
            </span>
            <span className="font-mono font-semibold text-blue-600">
              {formatCurrency(currentRole.annualCompensation, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
