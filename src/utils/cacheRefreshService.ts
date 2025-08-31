import { getStockCache } from './stockCache';
import { getRateLimiter } from './rateLimiter';
import { StockQuote } from '../types';
import axios from 'axios';

interface RefreshResult {
  success: boolean;
  data?: StockQuote;
  fromCache: boolean;
  rateLimitReached?: boolean;
  error?: string;
}

class CacheRefreshService {
  private readonly FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
  private readonly stockCache = getStockCache();
  private readonly rateLimiter = getRateLimiter();

  /**
   * Intelligently fetches stock data with caching and rate limiting
   * @param symbol Stock symbol to fetch
   * @param forceRefresh Force refresh even if cached data is valid
   * @returns Promise with stock data and metadata
   */
  public async getStockData(symbol: string, forceRefresh: boolean = false): Promise<RefreshResult> {
    const normalizedSymbol = symbol.toUpperCase();
    
    // Check if we have valid cached data
    const cachedData = this.stockCache.get(normalizedSymbol);
    const hasValidCache = this.stockCache.has(normalizedSymbol);

    // Return cached data if valid and not forcing refresh
    if (hasValidCache && !forceRefresh && !this.shouldRefreshNow(normalizedSymbol)) {
      return {
        success: true,
        data: cachedData!,
        fromCache: true
      };
    }

    // Check rate limit before making API call
    if (!this.rateLimiter.canMakeRequest()) {
      // Rate limit reached, return cached data if available
      if (cachedData) {
        console.warn(`Rate limit reached. Serving cached data for ${normalizedSymbol}`);
        return {
          success: true,
          data: cachedData,
          fromCache: true,
          rateLimitReached: true
        };
      } else {
        return {
          success: false,
          fromCache: false,
          rateLimitReached: true,
          error: 'Rate limit reached and no cached data available'
        };
      }
    }

    // Decide whether to refresh based on market hours and staleness
    const shouldRefresh = forceRefresh || this.shouldRefreshNow(normalizedSymbol);
    
    if (!shouldRefresh && cachedData) {
      return {
        success: true,
        data: cachedData,
        fromCache: true
      };
    }

    // Make API call to refresh data
    try {
      const freshData = await this.fetchFreshData(normalizedSymbol);
      
      // Record the API call
      this.rateLimiter.recordAPICall();
      
      // Cache the fresh data
      this.stockCache.set(normalizedSymbol, freshData);
      
      console.log(`Refreshed data for ${normalizedSymbol}. Remaining calls: ${this.rateLimiter.getRemainingCalls()}`);
      
      return {
        success: true,
        data: freshData,
        fromCache: false
      };
    } catch (error) {
      console.error(`Error fetching fresh data for ${normalizedSymbol}:`, error);
      
      // Fallback to cached data if available
      if (cachedData) {
        console.warn(`API error. Serving cached data for ${normalizedSymbol}`);
        return {
          success: true,
          data: cachedData,
          fromCache: true,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
      
      return {
        success: false,
        fromCache: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Determines if data should be refreshed based on market hours and staleness
   */
  private shouldRefreshNow(symbol: string): boolean {
    const isMarketHours = this.isMarketHours();
    const isStale = this.stockCache.isStale(symbol);
    const hasData = this.stockCache.has(symbol);

    // Always refresh if no data exists
    if (!hasData) {
      return true;
    }

    // During market hours, refresh stale data more aggressively
    if (isMarketHours) {
      return isStale;
    }

    // After hours, only refresh if data is very stale (expired)
    return !this.stockCache.has(symbol);
  }

  /**
   * Checks if current time is during market hours
   */
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

  /**
   * Fetches fresh data from Financial Modeling Prep API
   */
  private async fetchFreshData(symbol: string): Promise<StockQuote> {
    const apiKey = process.env.FMP_API_KEY;
    
    if (!apiKey) {
      throw new Error('FMP_API_KEY is not configured');
    }

    const url = `${this.FMP_BASE_URL}/quote/${symbol}?apikey=${apiKey}`;
    const response = await axios.get(url);
    
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      throw new Error(`No data found for symbol ${symbol}`);
    }

    const quote = response.data[0];
    
    return {
      symbol: quote.symbol,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changesPercentage,
      dayHigh: quote.dayHigh || quote.price,
      dayLow: quote.dayLow || quote.price,
      volume: quote.volume || 0,
      avgVolume: quote.avgVolume || 0,
      marketCap: quote.marketCap || 0,
      pe: quote.pe || null,
      eps: quote.eps || null,
      high: quote.dayHigh || quote.price,
      low: quote.dayLow || quote.price,
      open: quote.open || quote.price,
      previousClose: quote.previousClose || quote.price,
      fiftyTwoWeekRange: `${quote.yearLow || quote.price} - ${quote.yearHigh || quote.price}`
    };
  }

  /**
   * Preloads data for multiple symbols during off-peak hours
   */
  public async preloadSymbols(symbols: string[]): Promise<void> {
    if (this.isMarketHours()) {
      console.log('Skipping preload during market hours to conserve API calls');
      return;
    }

    const remainingCalls = this.rateLimiter.getRemainingCalls();
    const symbolsToLoad = symbols.slice(0, Math.min(symbols.length, remainingCalls - 10)); // Keep 10 calls as buffer

    console.log(`Preloading ${symbolsToLoad.length} symbols...`);

    for (const symbol of symbolsToLoad) {
      if (!this.rateLimiter.canMakeRequest()) {
        console.log('Rate limit reached during preload');
        break;
      }

      try {
        await this.getStockData(symbol, false);
        // Small delay between requests to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error preloading ${symbol}:`, error);
      }
    }
  }

  /**
   * Gets cache and rate limiter statistics
   */
  public getStats() {
    const usageStats = this.rateLimiter.getUsageStats();
    return {
      cache: this.stockCache.getCacheStats(),
      rateLimiter: {
        remainingCalls: this.rateLimiter.getRemainingCalls(),
        usedCalls: this.rateLimiter.getCurrentUsage(),
        resetTime: usageStats.resetTime,
        limit: usageStats.limit
      },
      marketHours: this.isMarketHours()
    };
  }
}

// Singleton instance
let cacheRefreshServiceInstance: CacheRefreshService | null = null;

export function getCacheRefreshService(): CacheRefreshService {
  if (!cacheRefreshServiceInstance) {
    cacheRefreshServiceInstance = new CacheRefreshService();
  }
  return cacheRefreshServiceInstance;
}

export { CacheRefreshService };
export type { RefreshResult };