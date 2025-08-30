interface UsageRecord {
  date: string;
  count: number;
  lastReset: number;
}

class APIRateLimiter {
  private readonly DAILY_LIMIT = 250;
  private readonly STORAGE_KEY = 'fmp_api_usage';
  private usageRecord: UsageRecord;

  constructor(initialUsage: number = 35) {
    this.usageRecord = this.loadUsageRecord(initialUsage);
  }

  private loadUsageRecord(initialUsage: number): UsageRecord {
    if (typeof window === 'undefined') {
      // Server-side: use in-memory storage or file system
      const today = new Date().toISOString().split('T')[0];
      return {
        date: today,
        count: initialUsage,
        lastReset: Date.now()
      };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const record: UsageRecord = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        
        // Reset count if it's a new day
        if (record.date !== today) {
          return {
            date: today,
            count: 0,
            lastReset: Date.now()
          };
        }
        return record;
      }
    } catch (error) {
      console.error('Error loading usage record:', error);
    }

    // Default record
    const today = new Date().toISOString().split('T')[0];
    return {
      date: today,
      count: initialUsage,
      lastReset: Date.now()
    };
  }

  private saveUsageRecord(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usageRecord));
      } catch (error) {
        console.error('Error saving usage record:', error);
      }
    }
  }

  public canMakeRequest(): boolean {
    this.checkAndResetDaily();
    return this.usageRecord.count < this.DAILY_LIMIT;
  }

  public getRemainingCalls(): number {
    this.checkAndResetDaily();
    return Math.max(0, this.DAILY_LIMIT - this.usageRecord.count);
  }

  public getCurrentUsage(): number {
    this.checkAndResetDaily();
    return this.usageRecord.count;
  }

  public recordAPICall(): boolean {
    this.checkAndResetDaily();
    
    if (this.usageRecord.count >= this.DAILY_LIMIT) {
      return false;
    }

    this.usageRecord.count++;
    this.saveUsageRecord();
    return true;
  }

  public getUsageStats(): { used: number; remaining: number; limit: number; resetTime: string } {
    this.checkAndResetDaily();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return {
      used: this.usageRecord.count,
      remaining: this.getRemainingCalls(),
      limit: this.DAILY_LIMIT,
      resetTime: tomorrow.toISOString()
    };
  }

  private checkAndResetDaily(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.usageRecord.date !== today) {
      this.usageRecord = {
        date: today,
        count: 0,
        lastReset: Date.now()
      };
      this.saveUsageRecord();
    }
  }

  public forceReset(): void {
    const today = new Date().toISOString().split('T')[0];
    this.usageRecord = {
      date: today,
      count: 0,
      lastReset: Date.now()
    };
    this.saveUsageRecord();
  }
}

// Singleton instance
let rateLimiterInstance: APIRateLimiter | null = null;

export function getRateLimiter(): APIRateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new APIRateLimiter();
  }
  return rateLimiterInstance;
}

export { APIRateLimiter };