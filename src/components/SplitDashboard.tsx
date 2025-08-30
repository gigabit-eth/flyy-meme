"use client";

import { CardData } from "@/types";
import StockPanel from "./StockPanel";
import CryptoPanel from "./CryptoPanel";
import BrandHeader from "./BrandHeader";

interface SplitDashboardProps {
  stockData: CardData | null;
  loading?: boolean;
  error?: string | null;
  lastUpdated?: string;
}

export default function SplitDashboard({
  stockData,
  loading,
  error,
  lastUpdated,
}: SplitDashboardProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">
          Loading flyy.meme dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container relative min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Floating Brand Header */}
      <BrandHeader />

      {/* Stock Panel - Top on mobile, Left on desktop */}
      <div className="stock-panel flex-1 bg-black text-white p-5 md:p-10 flex flex-col justify-center items-center min-h-[50vh] md:min-h-screen">
        {stockData && <StockPanel data={stockData} />}
      </div>

      {/* Crypto Panel - Bottom on mobile, Right on desktop */}
      <div className="crypto-panel flex-1 bg-yellow-400 text-black p-5 md:p-10 flex flex-col justify-center items-center min-h-[50vh] md:min-h-screen">
        <CryptoPanel />
      </div>

      {/* Footer - Hidden on mobile, shown on larger screens */}
      {/* {lastUpdated && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm hidden md:block">
          Last updated: {lastUpdated}
        </div>
      )} */}
    </div>
  );
}
