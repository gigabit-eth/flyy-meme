"use client";

import { useState, useEffect } from "react";
import SplitDashboard from "@/components/SplitDashboard";
import { CardData, StockQuote, CryptoData, ApiResponse } from "@/types";

export default function Home() {
  const [stockData, setStockData] = useState<CardData | null>(null);
  const [cryptoData, setCryptoData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchStockData = async () => {
    try {
      const response = await fetch("/api/stock/FLYY");
      const result: ApiResponse<StockQuote> = await response.json();

      if (result.success && result.data) {
        const stock = result.data;
        setStockData({
          type: "stock",
          symbol: stock.symbol,
          name: "Spirit Airlines Inc.",
          exchange: "OTC",
          marketCap: stock.marketCap && stock.marketCap > 0 ? `$${(stock.marketCap / 1000000).toFixed(0)}M` : "N/A",
          price: `$${stock.price.toFixed(2)}`,
          change: `$${stock.change.toFixed(2)}`,
          changePercent: `${stock.changePercent.toFixed(2)}`,
          dayHigh: `$${stock.dayHigh.toFixed(2)}`,
          dayLow: `$${stock.dayLow.toFixed(2)}`,
          volume: `${(stock.volume / 1000000).toFixed(1)}M`,
          additionalInfo: stock.fiftyTwoWeekRange || `$${stock.dayLow.toFixed(2)}-$${stock.dayHigh.toFixed(2)}`,
          isLive: true,
        });
      } else {
        // Show error state when API fails (rate limit, etc.)
        setStockData({
          type: "stock",
          symbol: "FLYY",
          name: "Spirit Airlines Inc.",
          exchange: "OTC",
          marketCap: "N/A",
          price: "Rate Limited",
          change: "N/A",
          changePercent: "N/A",
          dayHigh: "N/A",
          dayLow: "N/A",
          volume: "N/A",
          additionalInfo: result.error || "API Error",
          isLive: false,
        });
      }
    } catch (err) {
      console.error("Failed to fetch stock data:", err);
      // Show error state for network errors
      setStockData({
        type: "stock",
        symbol: "FLYY",
        name: "Spirit Airlines Inc.",
        exchange: "OTC",
        marketCap: "N/A",
        price: "Error",
        change: "N/A",
        changePercent: "N/A",
        dayHigh: "N/A",
        dayLow: "N/A",
        volume: "N/A",
        additionalInfo: "Network Error",
        isLive: false,
      });
    }
  };

  const fetchCryptoData = async () => {
    try {
      const response = await fetch("/api/crypto/FLYY");
      const result: ApiResponse<CryptoData> = await response.json();

      if (result.success && result.data) {
        const crypto = result.data;
        setCryptoData({
          type: "crypto",
          symbol: "FLYY",
          name: "Spirit Aviation Holdings",
          exchange: "Crypto",
          marketCap: "$1.2M",
          price: `$${crypto.price.toFixed(4)}`,
          change: `$${crypto.change.toFixed(4)}`,
          changePercent: `${crypto.changePercent.toFixed(2)}`,
          dayHigh: `$${crypto.dayHigh.toFixed(4)}`,
          dayLow: `$${crypto.dayLow.toFixed(4)}`,
          volume: `$${(crypto.volume / 1000000).toFixed(0)}M`,
          additionalInfo: `${(crypto.holders / 1000).toFixed(0)}K`,
          isLive: true,
        });
      }
    } catch (err) {
      console.error("Failed to fetch crypto data:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchStockData(), fetchCryptoData()]);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 15 minutes
    const interval = setInterval(fetchData, 900000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SplitDashboard 
      stockData={stockData}
      cryptoData={cryptoData}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
    />
  );
}
