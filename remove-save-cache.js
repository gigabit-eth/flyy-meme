// Script to remove SAVE from stock cache
// This can be run in browser console or as a Node.js script

// Browser version - run this in browser console
if (typeof window !== 'undefined') {
  console.log('Running in browser...');
  
  // Check current cache
  const cacheData = localStorage.getItem('stock_cache');
  if (cacheData) {
    const cache = JSON.parse(cacheData);
    console.log('Current cache contents:', Object.keys(cache));
    
    if (cache.SAVE) {
      console.log('Found SAVE in cache, removing...');
      delete cache.SAVE;
      localStorage.setItem('stock_cache', JSON.stringify(cache));
      console.log('SAVE removed from cache');
      console.log('Updated cache contents:', Object.keys(cache));
    } else {
      console.log('SAVE not found in cache');
    }
  } else {
    console.log('No cache found in localStorage');
  }
}

// Node.js version - for server-side cache inspection
else {
  console.log('This script is designed to run in the browser console.');
  console.log('To remove SAVE from cache:');
  console.log('1. Open browser developer tools');
  console.log('2. Go to Console tab');
  console.log('3. Paste and run this script');
  console.log('\nAlternatively, you can manually check localStorage:');
  console.log('localStorage.getItem("stock_cache")');
}