// Stock data interfaces for Financial Modeling Prep API
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  pe: number | null;
  eps: number | null;
  high: number;
  low: number;
  open: number;
  previousClose: number;
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