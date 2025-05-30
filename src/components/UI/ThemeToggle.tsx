"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative inline-flex h-8 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="absolute w-6 h-6 bg-white dark:bg-gray-100 rounded-full shadow-md transform -translate-x-3" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div
        className={`absolute inset-0 flex items-center justify-between px-1 transition-transform duration-300 ${
          theme === "dark" ? "translate-x-0" : "translate-x-0"
        }`}
      >
        {/* Sun icon (light mode) */}
        <div
          className={`w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center transition-all duration-300 ${
            theme === "light"
              ? "translate-x-6 opacity-100"
              : "translate-x-0 opacity-0"
          }`}
        >
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Moon icon (dark mode) */}
        <div
          className={`w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-200 flex items-center justify-center transition-all duration-300 ${
            theme === "dark"
              ? "translate-x-0 opacity-100"
              : "translate-x-6 opacity-0"
          }`}
        >
          <svg
            className="w-4 h-4 text-gray-200 dark:text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </div>
      </div>

      {/* Toggle indicator */}
      <div
        className={`absolute w-6 h-6 bg-white dark:bg-gray-100 rounded-full shadow-md transform transition-transform duration-300 ${
          theme === "light" ? "translate-x-3" : "-translate-x-3"
        }`}
      />
    </button>
  );
}
