// Stock data interfaces for Yahoo Finance API
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: number;
  fiftyTwoWeekRange: string;
}

// Crypto data interfaces
export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: number;
  holders: number;
}



// Card data interface for dashboard
export interface CardData {
  type: 'stock' | 'crypto';
  symbol: string;
  name: string;
  exchange: string;
  marketCap: string;
  price: string;
  change: string;
  changePercent: string;
  dayHigh: string;
  dayLow: string;
  volume: string;
  additionalInfo?: string;
  isLive: boolean;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}