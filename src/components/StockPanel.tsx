"use client";

import { CardData } from "@/types";
import { useState, useEffect } from "react";

interface StockPanelProps {
  data: CardData;
}

export default function StockPanel({ data }: StockPanelProps) {
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
  const changeColor = isPositive ? "text-green-400" : "text-red-400";
  const changeSign = isPositive ? "+" : "";

  return (
    <div className="text-center w-full max-w-md">
      {/* Crypto Label */}
      <div className="mb-4">
        <div className="text-yellow-400 text-sm font-medium uppercase tracking-wide opacity-70 cursor-pointer px-2 py-1 rounded transition-all duration-200 select-none">
          FLYY • NYSE
        </div>
      </div>

      {/* Market Cap - Large Display */}
      <div className="mb-8">
        <div className="text-yellow-400 text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold fugaz-one-regular">
          {data.marketCap}
        </div>
        <div className="text-yellow-400 text-sm uppercase tracking-wide">
          Market Capitalization
        </div>
      </div>

      {/* Current Price */}
      <div className="mb-8">
        <div className="text-yellow-400 text-4xl font-bold font-mono mb-2">
          {data.price}
        </div>
        <div className={`${changeColor} text-lg font-medium font-mono`}>
          {changeSign}
          {data.change} ({changeSign}
          {data.changePercent}%)
        </div>
      </div>

      {/* Additional Stats */}
      <div className="space-y-4 text-base sm:text-lg md:text-xl mb-8">
        <div className="flex justify-between">
          <span className="text-yellow-400 opacity-70">Day High:</span>
          <span className="text-yellow-400 font-mono font-semibold">{data.dayHigh}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-yellow-400 opacity-70">Day Low:</span>
          <span className="text-yellow-400 font-mono font-semibold">{data.dayLow}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-yellow-400 opacity-70">Volume:</span>
          <span className="text-yellow-400 font-mono font-semibold">{data.volume}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-yellow-400 opacity-70">52w Range:</span>
          <span className="text-yellow-400 font-mono font-semibold">
            {data.additionalInfo}
          </span>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center justify-center">
        <div
          className={`flex items-center gap-2 text-xs ${
            data.isLive ? "text-green-400" : "text-gray-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              data.isLive
                ? isBlinking
                  ? "bg-white"
                  : "bg-green-400"
                : "bg-gray-400"
            } transition-colors duration-200`}
          />
          {data.isLive ? "LIVE MARKET DATA" : "MARKET CLOSED"}
        </div>
      </div>
    </div>
  );
}
