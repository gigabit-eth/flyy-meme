// Debug script to investigate SAVE API calls
// Run this in browser console to check cache and monitor requests

console.log('=== SAVE Debug Investigation ===');

// 1. Check current cache contents
const cacheData = localStorage.getItem('stock_cache');
if (cacheData) {
  const cache = JSON.parse(cacheData);
  console.log('Current cache symbols:', Object.keys(cache));
  
  if (cache.SAVE) {
    console.log('SAVE found in cache:', cache.SAVE);
    console.log('SAVE timestamp:', new Date(cache.SAVE.timestamp));
    console.log('SAVE age (minutes):', (Date.now() - cache.SAVE.timestamp) / (1000 * 60));
  } else {
    console.log('SAVE not found in cache');
  }
} else {
  console.log('No cache found');
}

// 2. Monitor network requests for SAVE
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && url.includes('/api/stock/SAVE')) {
    console.log('🚨 SAVE API call detected:', url);
    console.trace('Call stack:');
  }
  return originalFetch.apply(this, args);
};

// 3. Remove SAVE from cache
if (cacheData) {
  const cache = JSON.parse(cacheData);
  if (cache.SAVE) {
    delete cache.SAVE;
    localStorage.setItem('stock_cache', JSON.stringify(cache));
    console.log('✅ SAVE removed from cache');
  }
}

console.log('=== Debug setup complete. Monitor console for SAVE calls ===');