"use client";

import { useState, useEffect } from "react";
import SplitDashboard from "@/components/SplitDashboard";
import { CardData, StockQuote, ApiResponse, PoolData } from "@/types";

export default function Home() {
  const [stockData, setStockData] = useState<CardData | null>(null);
  const [cryptoData, setCryptoData] = useState<PoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [shouldSwapPanels, setShouldSwapPanels] = useState(false);



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
      const response = await fetch("/api/crypto/pools/6eGhaAmcMJGUWgTxKDHY3opNmdXDZKxgbKt3P2uNR2m8");
      const result: ApiResponse<PoolData> = await response.json();

      if (result.success && result.data) {
        setCryptoData(result.data);
      } else {
        setCryptoData(null);
      }
    } catch (err) {
      console.error("Failed to fetch crypto data:", err);
      setCryptoData(null);
    }
  };

  const compareMarketCaps = () => {
    if (stockData && cryptoData) {
      // Extract numeric market cap from stock data (remove $ and M, convert to number)
      const stockMarketCapStr = stockData.marketCap.replace(/[$M]/g, '');
      const stockMarketCapNum = parseFloat(stockMarketCapStr);
      
      // Skip comparison if stock market cap is invalid (N/A, Error, etc.)
      if (isNaN(stockMarketCapNum) || stockMarketCapNum <= 0) {
        return;
      }
      
      // Crypto market cap is in USD, convert to millions
      const cryptoMarketCapNum = cryptoData.fdvUsd / 1000000;
      
      // If crypto market cap exceeds stock market cap, swap panels
      setShouldSwapPanels(cryptoMarketCapNum > stockMarketCapNum);
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

  // Compare market caps whenever data changes
  useEffect(() => {
    compareMarketCaps();
  }, [stockData, cryptoData]);

  return (
    <SplitDashboard 
      stockData={stockData}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      shouldSwapPanels={shouldSwapPanels}
    />
  );
}
