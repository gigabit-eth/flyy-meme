/**
 * Market hours utility functions
 */

/**
 * Checks if current time is during market hours
 * Market hours: 9:30 AM to 4:00 PM EST, Monday-Friday
 * @returns boolean indicating if market is currently open
 */
export function isMarketHours(): boolean {
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
 * Gets a human-readable market status
 * @returns string describing current market status
 */
export function getMarketStatus(): string {
  const now = new Date();
  const day = now.getDay();
  
  if (day === 0 || day === 6) {
    return "Market closed (Weekend)";
  }
  
  if (isMarketHours()) {
    return "Market open";
  }
  
  return "Market closed (After hours)";
}

/**
 * Gets the next market open time
 * @returns Date object representing next market open
 */
export function getNextMarketOpen(): Date {
  const now = new Date();
  const nextOpen = new Date(now);
  
  // Set to 9:30 AM
  nextOpen.setHours(9, 30, 0, 0);
  
  // If it's already past 9:30 AM today, move to next business day
  if (now.getTime() >= nextOpen.getTime()) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }
  
  // Skip weekends
  while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }
  
  return nextOpen;
}