"use client";

import { CardData } from "@/types";
import { useState, useEffect } from "react";

interface CryptoPanelProps {
  data: CardData;
}

export default function CryptoPanel({ data }: CryptoPanelProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Simulate live data blinking effect
  useEffect(() => {
    if (data.isLive) {
      const interval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [data.isLive]);

  const isPositive = parseFloat(data.changePercent) >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const changeSign = isPositive ? "+" : "";

  return (
    <div className="text-center w-full max-w-md">
      {/* Crypto Label */}
      <div className="mb-4">
        <div className="text-black text-sm font-medium uppercase tracking-wide opacity-70">
          CRYPTO • {data.symbol}
        </div>
      </div>

      {/* Company Name */}
      <div className="mb-8">
        <h2 className="text-black text-xl font-medium">{data.name}</h2>
      </div>

      {/* Market Cap - Large Display */}
      <div className="mb-8">
        <div className="text-black text-6xl font-bold mb-2 font-mono">
          {data.marketCap}
        </div>
        <div className="text-black text-sm uppercase tracking-wide opacity-70">
          Market Capitalization
        </div>
      </div>

      {/* Current Price */}
      <div className="mb-8">
        <div className="text-black text-4xl font-bold font-mono mb-2">
          {data.price}
        </div>
        <div className={`${changeColor} text-lg font-medium font-mono`}>
          {changeSign}
          {data.change} ({changeSign}
          {data.changePercent}%)
        </div>
      </div>

      {/* Additional Stats */}
      <div className="space-y-3 text-sm mb-8">
        <div className="flex justify-between">
          <span className="text-black opacity-70">24H VOL:</span>
          <span className="text-black font-mono font-medium">
            {data.volume}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black opacity-70">HOLDERS:</span>
          <span className="text-black font-mono font-medium">
            {data.additionalInfo}
          </span>
        </div>
      </div>

      {/* Live Indicator - Bottom Right Style */}
      <div className="flex items-center justify-end">
        <div
          className={`flex items-center gap-2 text-xs ${
            data.isLive ? "text-green-600" : "text-gray-600"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              data.isLive
                ? isBlinking
                  ? "bg-black"
                  : "bg-green-600"
                : "bg-gray-600"
            } transition-colors duration-200`}
          />
          <span className="font-medium">
            {data.isLive ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>
    </div>
  );
}
