import { NextRequest, NextResponse } from "next/server";
import { getCacheRefreshService } from "../../../../utils/cacheRefreshService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const cacheRefreshService = getCacheRefreshService();

    // Check for force refresh parameter
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";

    // Get stock data using the intelligent caching and rate limiting framework
    const result = await cacheRefreshService.getStockData(symbol, forceRefresh);

    if (!result.success) {
      if (result.rateLimitReached) {
        return NextResponse.json(
          {
            error: "API rate limit reached. Please try again later.",
            rateLimitReached: true,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: result.error || "Failed to fetch stock data" },
        { status: 500 }
      );
    }

    // Return proper ApiResponse structure expected by frontend
    const apiResponse = {
      success: true,
      data: {
        ...result.data,
        _metadata: {
          fromCache: result.fromCache,
          rateLimitReached: result.rateLimitReached || false,
          timestamp: new Date().toISOString(),
        },
      },
    };

    // Set appropriate cache headers
    const headers = new Headers();
    if (result.fromCache) {
      headers.set("X-Cache-Status", "HIT");
      headers.set("Cache-Control", "public, max-age=60"); // Cache for 1 minute
    } else {
      headers.set("X-Cache-Status", "MISS");
      headers.set("Cache-Control", "public, max-age=30"); // Cache fresh data for 30 seconds
    }

    if (result.rateLimitReached) {
      headers.set("X-Rate-Limit-Reached", "true");
    }

    return NextResponse.json(apiResponse, { headers });
  } catch (error) {
    console.error("Error in stock API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add a new endpoint to get cache and rate limiter statistics
export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const cacheRefreshService = getCacheRefreshService();
    const stats = cacheRefreshService.getStats();

    return NextResponse.json({
      symbol,
      stats,
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    return NextResponse.json(
      { error: "Failed to get statistics" },
      { status: 500 }
    );
  }
}
