"use client";

import { CardData } from "@/types";
import StockPanel from "./StockPanel";
import CryptoPanel from "./CryptoPanel";
import BrandHeader from "./BrandHeader";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface SplitDashboardProps {
  stockData: CardData | null;
  loading?: boolean;
  error?: string | null;
  lastUpdated?: string;
  shouldSwapPanels?: boolean;
}

export default function SplitDashboard({
  stockData,
  loading,
  error,
  shouldSwapPanels = false,
}: SplitDashboardProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="192"
            height="192"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plane-icon lucide-plane"
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
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

  // Animation variants for smooth transitions
  const mobileVariants: Variants = {
    top: {
      y: "0%",
      x: "0%",
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 26,
        mass: 1,
      },
    },
    bottom: {
      y: "100%",
      x: "0%",
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 26,
        mass: 1,
      },
    },
  };

  const desktopVariants: Variants = {
    left: {
      x: "0%",
      y: "0%",
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 26,
        mass: 1,
      },
    },
    right: {
      x: "100%",
      y: "0%",
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 26,
        mass: 1,
      },
    },
  };

  const panelVariants = isMobile ? mobileVariants : desktopVariants;

  return (
    <div className="dashboard-container relative min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Floating Brand Header */}
      <BrandHeader />

      {/* Animated Panel Container */}
      <div className="relative flex-1 flex flex-col md:flex-row">
        {/* Stock Panel */}
        <motion.div
          className={`stock-panel flex-1 bg-black text-white p-5 md:p-10 flex flex-col justify-center items-center min-h-[50vh] md:min-h-screen ${
            isMobile
              ? "absolute w-full h-1/2"
              : "md:absolute md:w-1/2 md:h-full"
          }`}
          variants={panelVariants}
          animate={
            isMobile
              ? shouldSwapPanels
                ? "bottom"
                : "top"
              : shouldSwapPanels
              ? "right"
              : "left"
          }
          style={{ zIndex: shouldSwapPanels ? 2 : 1 }}
        >
          {stockData && <StockPanel data={stockData} />}
        </motion.div>

        {/* Crypto Panel */}
        <motion.div
          className={`crypto-panel flex-1 bg-yellow-400 text-black p-5 md:p-10 flex flex-col justify-center items-center min-h-[50vh] md:min-h-screen ${
            isMobile
              ? "absolute w-full h-1/2"
              : "md:absolute md:w-1/2 md:h-full"
          }`}
          variants={panelVariants}
          animate={
            isMobile
              ? shouldSwapPanels
                ? "top"
                : "bottom"
              : shouldSwapPanels
              ? "left"
              : "right"
          }
          style={{ zIndex: shouldSwapPanels ? 1 : 2 }}
        >
          <CryptoPanel />
        </motion.div>
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
