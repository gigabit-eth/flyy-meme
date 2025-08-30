import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

// GeckoTerminal Pools API response interface
interface GeckoTerminalPoolResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      base_token_price_usd: string;
      base_token_price_native_currency: string;
      quote_token_price_usd: string;
      quote_token_price_native_currency: string;
      base_token_price_quote_token: string;
      quote_token_price_base_token: string;
      address: string;
      name: string;
      pool_name: string;
      pool_fee_percentage: string | null;
      pool_created_at: string;
      fdv_usd: string;
      market_cap_usd: string | null;
      price_change_percentage: {
        m5: string;
        m15: string;
        m30: string;
        h1: string;
        h6: string;
        h24: string;
      };
      transactions: {
        m5: {
          buys: number;
          sells: number;
          buyers: number;
          sellers: number;
        };
        m15: {
          buys: number;
          sells: number;
          buyers: number;
          sellers: number;
        };
        m30: {
          buys: number;
          sells: number;
          buyers: number;
          sellers: number;
        };
        h1: {
          buys: number;
          sells: number;
          buyers: number;
          sellers: number;
        };
        h6: {
          buys: number;
          sells: number;
          buyers: number;
          sellers: number;
        };
        h24: {
          buys: number;
          sells: number;
          buyers: number;
          sellers: number;
        };
      };
      volume_usd: {
        m5: string;
        m15: string;
        m30: string;
        h1: string;
        h6: string;
        h24: string;
      };
      reserve_in_usd: string;
      locked_liquidity_percentage: string;
    };
    relationships: {
      base_token: {
        data: {
          id: string;
          type: string;
        };
      };
      quote_token: {
        data: {
          id: string;
          type: string;
        };
      };
      dex: {
        data: {
          id: string;
          type: string;
        };
      };
    };
  };
}

// Pool data interface for our response
interface PoolData {
  id: string;
  name: string;
  poolName: string;
  address: string;
  baseTokenPriceUsd: number;
  quoteTokenPriceUsd: number;
  fdvUsd: number;
  marketCapUsd: number | null;
  priceChangePercentage: {
    m5: number;
    m15: number;
    m30: number;
    h1: number;
    h6: number;
    h24: number;
  };
  transactions: {
    m5: { buys: number; sells: number; buyers: number; sellers: number };
    m15: { buys: number; sells: number; buyers: number; sellers: number };
    m30: { buys: number; sells: number; buyers: number; sellers: number };
    h1: { buys: number; sells: number; buyers: number; sellers: number };
    h6: { buys: number; sells: number; buyers: number; sellers: number };
    h24: { buys: number; sells: number; buyers: number; sellers: number };
  };
  volumeUsd: {
    m5: number;
    m15: number;
    m30: number;
    h1: number;
    h6: number;
    h24: number;
  };
  reserveInUsd: number;
  lockedLiquidityPercentage: number;
  poolCreatedAt: string;
  baseToken: {
    id: string;
    type: string;
  };
  quoteToken: {
    id: string;
    type: string;
  };
  dex: {
    id: string;
    type: string;
  };
}

const GECKO_TERMINAL_POOLS_BASE_URL = 'https://api.geckoterminal.com/api/v2/networks/solana/pools';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ poolId: string }> }
) {
  try {
    const { poolId } = await params;
    
    // Fetch data from GeckoTerminal Pools API
    const url = `${GECKO_TERMINAL_POOLS_BASE_URL}/${poolId}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`GeckoTerminal Pools API error: ${response.status}`);
    }

    const geckoData: GeckoTerminalPoolResponse = await response.json();
    const attributes = geckoData.data.attributes;
    const relationships = geckoData.data.relationships;
    
    // Transform GeckoTerminal pool data to our PoolData interface
    const poolData: PoolData = {
      id: geckoData.data.id,
      name: attributes.name,
      poolName: attributes.pool_name,
      address: attributes.address,
      baseTokenPriceUsd: parseFloat(attributes.base_token_price_usd),
      quoteTokenPriceUsd: parseFloat(attributes.quote_token_price_usd),
      fdvUsd: parseFloat(attributes.fdv_usd),
      marketCapUsd: attributes.market_cap_usd ? parseFloat(attributes.market_cap_usd) : null,
      priceChangePercentage: {
        m5: parseFloat(attributes.price_change_percentage.m5),
        m15: parseFloat(attributes.price_change_percentage.m15),
        m30: parseFloat(attributes.price_change_percentage.m30),
        h1: parseFloat(attributes.price_change_percentage.h1),
        h6: parseFloat(attributes.price_change_percentage.h6),
        h24: parseFloat(attributes.price_change_percentage.h24),
      },
      transactions: {
        m5: attributes.transactions.m5,
        m15: attributes.transactions.m15,
        m30: attributes.transactions.m30,
        h1: attributes.transactions.h1,
        h6: attributes.transactions.h6,
        h24: attributes.transactions.h24,
      },
      volumeUsd: {
        m5: parseFloat(attributes.volume_usd.m5),
        m15: parseFloat(attributes.volume_usd.m15),
        m30: parseFloat(attributes.volume_usd.m30),
        h1: parseFloat(attributes.volume_usd.h1),
        h6: parseFloat(attributes.volume_usd.h6),
        h24: parseFloat(attributes.volume_usd.h24),
      },
      reserveInUsd: parseFloat(attributes.reserve_in_usd),
      lockedLiquidityPercentage: parseFloat(attributes.locked_liquidity_percentage),
      poolCreatedAt: attributes.pool_created_at,
      baseToken: relationships.base_token.data,
      quoteToken: relationships.quote_token.data,
      dex: relationships.dex.data,
    };

    return NextResponse.json<ApiResponse<PoolData>>({
      success: true,
      data: poolData
    });

  } catch (error) {
    console.error('Crypto Pools API error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch pool data'
    }, { status: 500 });
  }
}