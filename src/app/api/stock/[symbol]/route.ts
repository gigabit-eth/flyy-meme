import { NextRequest, NextResponse } from "next/server";
import { StockQuote, ApiResponse } from "@/types";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    console.log(`[Stock API] Fetching data for symbol: ${symbol}`);

    const apiKey = process.env.FMP_API_KEY;
    if (!apiKey) {
      console.error("[Stock API] FMP_API_KEY not found in environment variables");
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "API configuration error",
        },
        { status: 500 }
      );
    }

    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`;
    console.log(`[Stock API] Requesting URL: ${url}`);

    const response = await axios.get(url);
    console.log(`[Stock API] Response status: ${response.status}`);
    console.log(
      "[Stock API] Raw API response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if Financial Modeling Prep returned data
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.error("[Stock API] No data found for symbol:", symbol);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Symbol not found or invalid",
        },
        { status: 404 }
      );
    }

    const stockData = response.data[0];
    if (!stockData) {
      console.error("[Stock API] Empty stock data received");
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "No data available for this symbol",
        },
        { status: 404 }
      );
    }

    // Transform Financial Modeling Prep data to our StockQuote interface
    const stockQuote: StockQuote = {
      symbol: stockData.symbol,
      price: stockData.price || 0,
      change: stockData.change || 0,
      changePercent: stockData.changesPercentage || 0,
      dayHigh: stockData.dayHigh || 0,
      dayLow: stockData.dayLow || 0,
      volume: stockData.volume || 0,
      marketCap: stockData.marketCap || 0,
      fiftyTwoWeekRange: `${stockData.yearLow || 0} - ${stockData.yearHigh || 0}`,
    };

    return NextResponse.json<ApiResponse<StockQuote>>({
      success: true,
      data: stockQuote,
    });
  } catch (error: unknown) {
    console.error("Stock API error:", error);

    // Handle axios errors specifically
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 404) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: "Symbol not found or invalid",
          },
          { status: 404 }
        );
      } else if (status === 429) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: "Rate limit exceeded, please try again later",
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: "Failed to fetch stock data",
      },
      { status: 500 }
    );
  }
}
