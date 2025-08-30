import { StockQuote } from '../types';

interface CachedStockData {
  data: StockQuote;
  timestamp: number;
  symbol: string;
}

interface CacheStorage {
  [symbol: string]: CachedStockData;
}

class StockCache {
  private readonly CACHE_KEY = 'stock_cache';
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly MARKET_HOURS_TTL = 2 * 60 * 1000; // 2 minutes during market hours
  private readonly AFTER_HOURS_TTL = 15 * 60 * 1000; // 15 minutes after hours
  private cache: CacheStorage = {};

  constructor() {
    this.loadCache();
  }

  private loadCache(): void {
    if (typeof window === 'undefined') {
      // Server-side: use in-memory cache only
      return;
    }

    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        this.cache = JSON.parse(stored);
        // Clean expired entries on load
        this.cleanExpiredEntries();
      }
    } catch (error) {
      console.error('Error loading cache:', error);
      this.cache = {};
    }
  }

  private saveCache(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache));
      } catch (error) {
        console.error('Error saving cache:', error);
      }
    }
  }

  private cleanExpiredEntries(): void {
    const now = Date.now();
    const validEntries: CacheStorage = {};

    Object.entries(this.cache).forEach(([symbol, cachedData]) => {
      if (!this.isExpired(cachedData, now)) {
        validEntries[symbol] = cachedData;
      }
    });

    this.cache = validEntries;
    this.saveCache();
  }

  private isExpired(cachedData: CachedStockData, currentTime: number = Date.now()): boolean {
    const age = currentTime - cachedData.timestamp;
    const ttl = this.getTTL();
    return age > ttl;
  }

  private getTTL(): number {
    if (this.isMarketHours()) {
      return this.MARKET_HOURS_TTL;
    }
    return this.AFTER_HOURS_TTL;
  }

  private isMarketHours(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // Weekend check
    if (day === 0 || day === 6) {
      return false;
    }

    // Market hours: 9:30 AM to 4:00 PM EST (converted to minutes)
    const marketOpen = 9 * 60 + 30; // 9:30 AM
    const marketClose = 16 * 60; // 4:00 PM

    return timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
  }

  public get(symbol: string): StockQuote | null {
    const normalizedSymbol = symbol.toUpperCase();
    const cachedData = this.cache[normalizedSymbol];

    if (!cachedData) {
      return null;
    }

    if (this.isExpired(cachedData)) {
      // Remove expired entry
      delete this.cache[normalizedSymbol];
      this.saveCache();
      return null;
    }

    return cachedData.data;
  }

  public set(symbol: string, data: StockQuote): void {
    const normalizedSymbol = symbol.toUpperCase();
    const cachedData: CachedStockData = {
      data,
      timestamp: Date.now(),
      symbol: normalizedSymbol
    };

    this.cache[normalizedSymbol] = cachedData;
    this.saveCache();
  }

  public has(symbol: string): boolean {
    const normalizedSymbol = symbol.toUpperCase();
    const cachedData = this.cache[normalizedSymbol];
    return cachedData ? !this.isExpired(cachedData) : false;
  }

  public isStale(symbol: string): boolean {
    const normalizedSymbol = symbol.toUpperCase();
    const cachedData = this.cache[normalizedSymbol];
    
    if (!cachedData) {
      return true;
    }

    // Consider data stale if it's older than half the TTL
    const age = Date.now() - cachedData.timestamp;
    const staleTTL = this.getTTL() / 2;
    return age > staleTTL;
  }

  public remove(symbol: string): void {
    const normalizedSymbol = symbol.toUpperCase();
    delete this.cache[normalizedSymbol];
    this.saveCache();
  }

  public clear(): void {
    this.cache = {};
    this.saveCache();
  }

  public getCacheStats(): {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    cacheSize: string;
  } {
    const now = Date.now();
    let validCount = 0;
    let expiredCount = 0;

    Object.values(this.cache).forEach(cachedData => {
      if (this.isExpired(cachedData, now)) {
        expiredCount++;
      } else {
        validCount++;
      }
    });

    const cacheSize = typeof window !== 'undefined' 
      ? (localStorage.getItem(this.CACHE_KEY)?.length || 0) + ' characters'
      : 'N/A (server-side)';

    return {
      totalEntries: validCount + expiredCount,
      validEntries: validCount,
      expiredEntries: expiredCount,
      cacheSize
    };
  }

  public getLastUpdated(symbol: string): Date | null {
    const normalizedSymbol = symbol.toUpperCase();
    const cachedData = this.cache[normalizedSymbol];
    return cachedData ? new Date(cachedData.timestamp) : null;
  }
}

// Singleton instance
let stockCacheInstance: StockCache | null = null;

export function getStockCache(): StockCache {
  if (!stockCacheInstance) {
    stockCacheInstance = new StockCache();
  }
  return stockCacheInstance;
}

export { StockCache };