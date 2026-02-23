import React, { useRef } from "react";
import { toPng } from "html-to-image";

// Mirroring the types from the parent component for type safety
type TradeDirection =
  | "BUY"
  | "SELL"
  | "HOLD"
  | "TRAIL_SL_TO_COST"
  | "BOOK_PARTIAL_PROFIT"
  | "EXIT_AT_COST"
  | "EXIT_AT_STOPLOSS"
  | "BOOK_PROFIT_AT_TARGET";
type TradeCategory =
  | "INTRADAY"
  | "BTST"
  | "POSITIONAL"
  | "POSITION_TRADE"
  | "SWING"
  | "SHORT_TERM"
  | "MEDIUM_TERM"
  | "LONG_TERM";
type NotificationType =
  | "TRADE_LIVE"
  | "TRADE_UPDATE"
  | "TRADE_CLOSED"
  | "SILENT";

interface TradeFormData {
  stockId: string;
  direction: TradeDirection;
  category: TradeCategory;
  minEntryPrice: string;
  maxEntryPrice: string;
  currentMarketPrice: string;
  minTargetPrice: string;
  maxTargetPrice: string;
  stopLoss: string;
  stopLossType: string;
  bookProfitPrice: string;
  notes: string;
  isRisky: boolean;
  notificationType: NotificationType;
  sendMode: string;
  scheduledDateTime: string | null;
}

interface PreviewCardProps {
  formData: TradeFormData;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ formData }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  // Helper to determine badge colors based on trade direction
  const getDirectionColor = (dir: TradeDirection) => {
    if (dir === "BUY") return "bg-green-100 text-green-800 border-green-200";
    if (dir === "SELL") return "bg-red-100 text-red-800 border-red-200";
    if (dir === "HOLD")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-blue-100 text-blue-800 border-blue-200"; // Default for updates/exits
  };

  const today = new Date();

  const formattedDate = today.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleAPI = async () => {
    // 1. Map React state names to Postman/Backend expected names
    // 2. Convert string prices to numbers using Number()
    const payload = {
      stockSearch: formData.stockId,
      tradeDirection: formData.direction,
      tradeCategory: formData.category,
      minEntryPrice: Number(formData.minEntryPrice),
      maxEntryPrice: Number(formData.maxEntryPrice),
      currentMarketPrice: Number(formData.currentMarketPrice),
      minTargetPrice: Number(formData.minTargetPrice),
      maxTargetPrice: Number(formData.maxTargetPrice),
      stopLossPrice: Number(formData.stopLoss),
      stoplossType: formData.stopLossType,
      bookProfitPrice: Number(formData.bookProfitPrice),
      notes: formData.notes,
      isRiskyTrade: formData.isRisky,

      // Note: I left out notificationType, sendMode, and scheduledDateTime
      // because they were missing in your Postman payload.
      // Add them back here if your backend actually needs them!
    };

    try {
      // 3. Updated the port to 4000 to match Postman
      const response = await fetch("http://localhost:4000/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 4. Send the mapped payload instead of formData
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Trade created successfully:", data);
      } else {
        console.error("Backend returned an error:", data);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  const handleDownloadImage = async () => {
    if (cardRef.current === null) return;

    try {
      // Convert the referenced div to a PNG data URL
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true, // Helps prevent issues with cached images/fonts
        quality: 1.0,
        pixelRatio: 2, // Higher resolution image
      });

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.download = `${formData.stockId || "Trade-Preview"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Oops, something went wrong downloading the image!", err);
    }

    handleAPI();
  };

  return (
    <div className="">
      <div
        ref={cardRef}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden font-sans"
      >
        {/* Header Banner */}
        <div
          className={`px-5 py-4 border-b ${formData.isRisky ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                {formData.stockId || "STOCK SYMBOL"}
              </h3>
              <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">
                {formData.category.replace("_", " ")}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getDirectionColor(formData.direction)}`}
            >
              {formData.direction.replace(/_/g, " ")}
            </span>
          </div>

          {formData.isRisky && (
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-600 uppercase tracking-wide">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              High Risk Trade
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-5 space-y-5">
          {/* Price Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Entry Box */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                Entry Range
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formData.minEntryPrice || "0.00"}
                {formData.maxEntryPrice && ` - ${formData.maxEntryPrice}`}
              </p>
              {formData.currentMarketPrice && (
                <>
                  <p className="text-xs text-gray-400 mt-1">
                    CMP: ₹{formData.currentMarketPrice}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
                </>
              )}
            </div>

            {/* Target Box */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <p className="text-xs text-green-700 font-medium uppercase mb-1">
                Target
              </p>
              <p className="text-sm font-semibold text-green-900">
                {formData.minTargetPrice || "0.00"}
                {formData.maxTargetPrice && ` - ${formData.maxTargetPrice}`}
              </p>
            </div>

            {/* Stop Loss Box */}
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 col-span-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-red-700 font-medium uppercase mb-1">
                    Stop Loss
                  </p>
                  <p className="text-sm font-semibold text-red-900">
                    {formData.stopLoss || "0.00"}
                    <span className="text-xs font-normal text-red-600 ml-1">
                      ({formData.stopLossType})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {formData.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                Analyst Notes
              </p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                {formData.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Settings Info */}
        <div className="bg-gray-100 px-5 py-3 text-xs text-gray-500 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </span>
          <span className="font-medium">
            {formData.sendMode === "SCHEDULED" && formData.scheduledDateTime
              ? `Scheduled: ${new Date(formData.scheduledDateTime).toLocaleString()}`
              : formData.sendMode === "DRAFT"
                ? "Draft Mode"
                : "Live Publish"}
          </span>
        </div>
      </div>

      <button
        onClick={handleDownloadImage}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
      >
        Download Card as Image
      </button>
    </div>
  );
};

export default PreviewCard;
