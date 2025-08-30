"use client";

import { PoolData, ApiResponse } from "@/types";
import { useState, useEffect } from "react";

interface CryptoPanelProps {
  poolId?: string;
}

export default function CryptoPanel({
  poolId = "6eGhaAmcMJGUWgTxKDHY3opNmdXDZKxgbKt3P2uNR2m8",
}: CryptoPanelProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [poolData, setPoolData] = useState<PoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pool data from API
  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/crypto/pools/${poolId}`);
        const result: ApiResponse<PoolData> = await response.json();

        if (result.success && result.data) {
          setPoolData(result.data);
        } else {
          setError(result.error || "Failed to fetch pool data");
        }
      } catch (err) {
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPoolData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchPoolData, 30000);
    return () => clearInterval(interval);
  }, [poolId]);

  // Live data blinking effect
  useEffect(() => {
    if (poolData) {
      const interval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [poolData]);

  // Loading state
  if (loading) {
    return (
      <div className="text-center w-full max-w-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-8"></div>
          <div className="h-16 bg-gray-200 rounded mb-8"></div>
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !poolData) {
    return (
      <div className="text-center w-full max-w-md">
        <div className="text-red-600 text-lg font-medium mb-4">Error</div>
        <div className="text-gray-600">{error || "No data available"}</div>
      </div>
    );
  }

  const isPositive = poolData.priceChangePercentage.h24 >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const changeSign = isPositive ? "+" : "";

  // Format numbers for display
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="text-center w-full max-w-md">
      {/* Crypto Label */}
      <div className="mb-4">
        <div className="text-black text-sm font-medium uppercase tracking-wide opacity-70">
          SOLANA • $FLYY
        </div>
      </div>

      {/* Company Name */}
      <div className="mb-8">
        <h2 className="text-black text-xl font-medium">
          {poolData.baseToken.name}
        </h2>
      </div>

      {/* Market Cap - Large Display */}
      <div className="mb-8">
        <div className="text-black text-6xl font-bold mb-2 font-mono">
          {formatCurrency(poolData.fdvUsd)}
        </div>
        <div className="text-black text-sm uppercase tracking-wide opacity-70">
          Market Capitalization (FDV)
        </div>
      </div>

      {/* Current Price */}
      <div className="mb-8">
        <div className="text-black text-4xl font-bold font-mono mb-2">
          ${poolData.baseTokenPriceUsd.toFixed(6)}
        </div>
        <div className={`${changeColor} text-lg font-medium font-mono`}>
          {changeSign}
          {poolData.priceChangePercentage.h24.toFixed(2)}%
        </div>
      </div>

      {/* Additional Stats */}
      <div className="space-y-3 text-sm mb-8">
        <div className="flex justify-between">
          <span className="text-black opacity-70">24H VOL:</span>
          <span className="text-black font-mono font-medium">
            {formatCurrency(poolData.volumeUsd.h24)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black opacity-70">24H TRADES:</span>
          <span className="text-black font-mono font-medium">
            {formatNumber(
              poolData.transactions.h24.buys + poolData.transactions.h24.sells
            )}
          </span>
        </div>
      </div>

      {/* Live Indicator - Bottom Right Style */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-green-600">
          <div
            className={`w-2 h-2 rounded-full ${
              isBlinking ? "bg-black" : "bg-green-600"
            } transition-colors duration-200`}
          />
          <span className="font-medium">LIVE</span>
        </div>
      </div>
    </div>
  );
}
