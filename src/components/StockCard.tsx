'use client';

import { CardData } from '@/types';
import { useState, useEffect } from 'react';

interface StockCardProps {
  data: CardData;
  className?: string;
}

export default function StockCard({ data, className = '' }: StockCardProps) {
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
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeSign = isPositive ? '+' : '';

  return (
    <div className={`bg-black border-2 border-yellow-400 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            data.isLive ? (isBlinking ? 'bg-yellow-400' : 'bg-green-400') : 'bg-gray-400'
          } transition-colors duration-200`} />
          <span className="text-yellow-400 font-medium">{data.name} ({data.symbol})</span>
        </div>
        <span className="text-yellow-400 text-sm font-medium bg-yellow-400/10 px-2 py-1 rounded">
          {data.exchange}
        </span>
      </div>

      {/* Market Cap */}
      <div className="mb-4">
        <div className="text-yellow-400 text-4xl font-bold">{data.marketCap}</div>
        <div className="text-gray-400 text-sm">Market Cap</div>
      </div>

      {/* Current Price */}
      <div className="mb-6">
        <div className="text-white text-2xl font-semibold">{data.price}</div>
        <div className={`${changeColor} text-sm font-medium`}>
          {changeSign}{data.change} ({changeSign}{data.changePercent}%)
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-gray-400 text-xs mb-1">Day High</div>
          <div className="text-white font-medium">{data.dayHigh}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">Day Low</div>
          <div className="text-white font-medium">{data.dayLow}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">
            {data.type === 'stock' ? 'Volume' : '24h Volume'}
          </div>
          <div className="text-white font-medium">{data.volume}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs mb-1">
            {data.type === 'stock' ? '52w Range' : 'Holders'}
          </div>
          <div className="text-white font-medium">{data.additionalInfo}</div>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center justify-center">
        <div className={`flex items-center gap-2 text-xs ${
          data.isLive ? 'text-green-400' : 'text-gray-400'
        }`}>
          <div className={`w-1 h-1 rounded-full ${
            data.isLive ? 'bg-green-400' : 'bg-gray-400'
          }`} />
          {data.isLive ? 
            (data.type === 'stock' ? 'Live Market Data' : 'Live Crypto Data') : 
            'Market Closed'
          }
        </div>
      </div>
    </div>
  );
}