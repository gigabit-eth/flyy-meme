import { NextRequest, NextResponse } from 'next/server';
import { AlphaVantageQuote, StockQuote, ApiResponse } from '@/types';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Alpha Vantage API key not configured'
      }, { status: 500 });
    }

    const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    const data: AlphaVantageQuote = await response.json();
    
    // Check if API returned an error or rate limit message
    if ('Error Message' in data || 'Note' in data) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'API rate limit exceeded or invalid symbol'
      }, { status: 429 });
    }

    const quote = data['Global Quote'];
    
    if (!quote) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'No data available for this symbol'
      }, { status: 404 });
    }

    // Transform Alpha Vantage data to our StockQuote interface
    const stockQuote: StockQuote = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      dayHigh: parseFloat(quote['03. high']),
      dayLow: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      marketCap: 0, // Alpha Vantage doesn't provide market cap in GLOBAL_QUOTE
      fiftyTwoWeekRange: `${quote['04. low']} - ${quote['03. high']}`
    };

    return NextResponse.json<ApiResponse<StockQuote>>({
      success: true,
      data: stockQuote
    });

  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch stock data'
    }, { status: 500 });
  }
}