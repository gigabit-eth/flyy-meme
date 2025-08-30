'use client';

import { useState, useEffect } from 'react';
import StockCard from '@/components/StockCard';
import { CardData, StockQuote, CryptoData, ApiResponse } from '@/types';

export default function Home() {
  const [stockData, setStockData] = useState<CardData | null>(null);
  const [cryptoData, setCryptoData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/stock/SAVE');
      const result: ApiResponse<StockQuote> = await response.json();
      
      if (result.success && result.data) {
        const stock = result.data;
        setStockData({
          type: 'stock',
          symbol: 'SAVE',
          name: 'Spirit Airlines',
          exchange: 'NYSE',
          marketCap: '$35.7M',
          price: `$${stock.price.toFixed(2)}`,
          change: `$${stock.change.toFixed(2)}`,
          changePercent: `${stock.changePercent.toFixed(2)}`,
          dayHigh: `$${stock.dayHigh.toFixed(2)}`,
          dayLow: `$${stock.dayLow.toFixed(2)}`,
          volume: `${(stock.volume / 1000000).toFixed(1)}M`,
          additionalInfo: `$${stock.dayLow.toFixed(2)}-$${stock.dayHigh.toFixed(2)}`,
          isLive: true
        });
      }
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
    }
  };

  const fetchCryptoData = async () => {
    try {
      const response = await fetch('/api/crypto/FLYY');
      const result: ApiResponse<CryptoData> = await response.json();
      
      if (result.success && result.data) {
        const crypto = result.data;
        setCryptoData({
          type: 'crypto',
          symbol: 'FLYY',
          name: 'Spirit Aviation Holdings',
          exchange: 'Crypto',
          marketCap: '$1.2M',
          price: `$${crypto.price.toFixed(4)}`,
          change: `$${crypto.change.toFixed(4)}`,
          changePercent: `${crypto.changePercent.toFixed(2)}`,
          dayHigh: `$${crypto.dayHigh.toFixed(4)}`,
          dayLow: `$${crypto.dayLow.toFixed(4)}`,
          volume: `$${(crypto.volume / 1000000).toFixed(0)}M`,
          additionalInfo: `${(crypto.holders / 1000).toFixed(0)}K`,
          isLive: true
        });
      }
    } catch (err) {
      console.error('Failed to fetch crypto data:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchStockData(), fetchCryptoData()]);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading flyy.meme dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-yellow-400 text-4xl font-bold mb-2">flyy.meme</h1>
      </div>

      {/* Cards Container */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {stockData && (
            <StockCard 
              data={stockData} 
              className="w-full"
            />
          )}
          {cryptoData && (
            <StockCard 
              data={cryptoData} 
              className="w-full"
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          Last updated: {lastUpdated} • Data provided for demonstration
        </div>
      </div>
    </div>
  );
}
