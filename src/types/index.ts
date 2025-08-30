// Stock data interfaces for Alpha Vantage API
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

// Alpha Vantage API response interfaces
export interface AlphaVantageQuote {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
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