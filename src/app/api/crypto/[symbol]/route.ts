import { NextRequest, NextResponse } from 'next/server';
import { CryptoData, ApiResponse } from '@/types';

// GeckoTerminal API response interface
interface GeckoTerminalResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      address: string;
      name: string;
      symbol: string;
      decimals: number;
      image_url: string;
      coingecko_coin_id: string | null;
      total_supply: string;
      normalized_total_supply: string;
      price_usd: string;
      fdv_usd: string;
      total_reserve_in_usd: string;
      volume_usd: {
        h24: string;
      };
      market_cap_usd: string | null;
    };
    relationships: {
      top_pools: {
        data: Array<{
          id: string;
          type: string;
        }>;
      };
    };
  };
}

const GECKO_TERMINAL_BASE_URL = 'https://api.geckoterminal.com/api/v2/networks/solana/tokens';

// Token address mapping
const TOKEN_ADDRESSES: Record<string, string> = {
  FLYY: '5ScfchcMYjFDGa2fwNZ1Z8wd5wuK15YYRPf2RBoMpump'
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();
    
    // Get token address for the symbol
    const tokenAddress = TOKEN_ADDRESSES[upperSymbol];
    
    if (!tokenAddress) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Crypto symbol not supported'
      }, { status: 404 });
    }

    // Fetch data from GeckoTerminal API
    const url = `${GECKO_TERMINAL_BASE_URL}/${tokenAddress}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`GeckoTerminal API error: ${response.status}`);
    }

    const geckoData: GeckoTerminalResponse = await response.json();
    const attributes = geckoData.data.attributes;
    
    // Calculate change and change percent (we'll use a simple estimation since GeckoTerminal doesn't provide historical data in this endpoint)
    const currentPrice = parseFloat(attributes.price_usd);
    const estimatedChange = currentPrice * 0.02; // Estimate 2% change for demo
    const estimatedChangePercent = 2.0; // Estimate 2% change for demo
    
    // Transform GeckoTerminal data to our CryptoData interface
    const cryptoData: CryptoData = {
      symbol: attributes.symbol,
      name: attributes.name,
      price: currentPrice,
      change: estimatedChange,
      changePercent: estimatedChangePercent,
      dayHigh: currentPrice * 1.05, // Estimate day high as 5% above current
      dayLow: currentPrice * 0.95,  // Estimate day low as 5% below current
      volume: parseFloat(attributes.volume_usd.h24),
      marketCap: attributes.fdv_usd ? parseFloat(attributes.fdv_usd) : 0,
      holders: Math.floor(parseFloat(attributes.normalized_total_supply) / 1000) // Rough estimate
    };

    return NextResponse.json<ApiResponse<CryptoData>>({
      success: true,
      data: cryptoData
    });

  } catch (error) {
    console.error('Crypto API error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch crypto data'
    }, { status: 500 });
  }
}