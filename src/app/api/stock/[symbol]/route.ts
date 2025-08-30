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

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    console.log(`[Stock API] Requesting URL: ${url}`);

    const response = await axios.get(url);
    console.log(`[Stock API] Response status: ${response.status}`);
    console.log(
      "[Stock API] Raw API response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if Yahoo Finance returned an error
    if (response.data.chart.error) {
      console.error(
        "[Stock API] Yahoo Finance API error:",
        response.data.chart.error
      );
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error:
            response.data.chart.error.description ||
            "Invalid symbol or no data found",
        },
        { status: 404 }
      );
    }

    const result = response.data.chart.result?.[0];
    if (!result) {
      console.error("[Stock API] No chart result found in response");
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "No data available for this symbol",
        },
        { status: 404 }
      );
    }

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];

    if (!meta || !quote) {
      console.error("[Stock API] Missing meta or quote data");
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "Incomplete data for this symbol",
        },
        { status: 404 }
      );
    }

    // Transform Yahoo Finance data to our StockQuote interface
    const change = meta.regularMarketPrice - meta.previousClose;
    const changePercent = (change / meta.previousClose) * 100;

    const stockQuote: StockQuote = {
      symbol: meta.symbol,
      price: meta.regularMarketPrice,
      change: change,
      changePercent: parseFloat(changePercent.toFixed(2)),
      dayHigh:
        quote.high?.[quote.high.length - 1] || meta.regularMarketDayHigh || 0,
      dayLow:
        quote.low?.[quote.low.length - 1] || meta.regularMarketDayLow || 0,
      volume:
        quote.volume?.[quote.volume.length - 1] ||
        meta.regularMarketVolume ||
        0,
      marketCap: 0, // Yahoo Finance chart API doesn't provide market cap
      fiftyTwoWeekRange: `${meta.fiftyTwoWeekLow || 0} - ${
        meta.fiftyTwoWeekHigh || 0
      }`,
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
