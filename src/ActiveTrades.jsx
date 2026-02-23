"use client";
import React, { useState } from "react";
import PreviewCard from "./PreviewCard"; // Ensure this component exists in your directory

// --- Type Definitions ---
// type TradeDirection =
//   | "BUY"
//   | "SELL"
//   | "HOLD"
//   | "TRAIL_SL_TO_COST"
//   | "BOOK_PARTIAL_PROFIT"
//   | "EXIT_AT_COST"
//   | "EXIT_AT_STOPLOSS"
//   | "BOOK_PROFIT_AT_TARGET";

// type TradeCategory =
//   | "INTRADAY"
//   | "BTST"
//   | "POSITIONAL"
//   | "POSITION_TRADE"
//   | "SWING"
//   | "SHORT_TERM"
//   | "MEDIUM_TERM"
//   | "LONG_TERM";

// type NotificationType = "TRADE_LIVE" | "TRADE_UPDATE" | "TRADE_CLOSED" | "SILENT";

// interface TradeFormData {
//   stockId: string;
//   direction: TradeDirection;
//   category: TradeCategory;
//   minEntryPrice: string;
//   maxEntryPrice: string;
//   currentMarketPrice: string;
//   minTargetPrice: string;
//   maxTargetPrice: string;
//   stopLoss: string;
//   stopLossType: string;
//   bookProfitPrice: string;
//   notes: string;
//   isRisky: boolean;
//   notificationType: NotificationType;
//   sendMode: string;
//   scheduledDateTime: string | null; // Changed to string to easily bind to datetime-local input
// }

const ActiveTrades = () => {
  const [formData, setFormData] = useState({
    stockId: "",
    direction: "BUY",
    category: "INTRADAY",
    minEntryPrice: "",
    maxEntryPrice: "",
    currentMarketPrice: "",
    minTargetPrice: "",
    maxTargetPrice: "",
    stopLoss: "",
    stopLossType: "Intraday",
    bookProfitPrice: "",
    notes: "",
    isRisky: false,
  });

  // Generic change handler for inputs, selects, and textareas
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle checkbox separately
    if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add API submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center font-sans text-gray-800">
      {/* Main Container */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
        {/* Left Side: Form (70%) */}
        <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create New Trade
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the details below to broadcast a new trade signal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock ID / Symbol
                </label>
                <input
                  type="text"
                  name="stockId"
                  value={formData.stockId}
                  onChange={handleChange}
                  placeholder="e.g. RELIANCE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Direction
                </label>
                <select
                  name="direction"
                  value={formData.direction}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                  <option value="HOLD">Hold</option>
                  <option value="TRAIL_SL_TO_COST">Trail SL to Cost</option>
                  <option value="BOOK_PARTIAL_PROFIT">
                    Book Partial Profit
                  </option>
                  <option value="EXIT_AT_COST">Exit at Cost</option>
                  <option value="EXIT_AT_STOPLOSS">Exit at Stoploss</option>
                  <option value="BOOK_PROFIT_AT_TARGET">
                    Book Profit at Target
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="INTRADAY">Intraday</option>
                  <option value="BTST">BTST</option>
                  <option value="POSITIONAL">Positional</option>
                  <option value="SWING">Swing</option>
                  <option value="SHORT_TERM">Short Term</option>
                  <option value="MEDIUM_TERM">Medium Term</option>
                  <option value="LONG_TERM">Long Term</option>
                </select>
              </div>
            </div>

            {/* Section 2: Pricing */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 space-y-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Price Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Entry Price
                  </label>
                  <input
                    type="number"
                    name="minEntryPrice"
                    value={formData.minEntryPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Entry Price
                  </label>
                  <input
                    type="number"
                    name="maxEntryPrice"
                    value={formData.maxEntryPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Market Price (CMP)
                  </label>
                  <input
                    type="number"
                    name="currentMarketPrice"
                    value={formData.currentMarketPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Target Price
                  </label>
                  <input
                    type="number"
                    name="minTargetPrice"
                    value={formData.minTargetPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Target Price
                  </label>
                  <input
                    type="number"
                    name="maxTargetPrice"
                    value={formData.maxTargetPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stop Loss
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="stopLoss"
                      value={formData.stopLoss}
                      onChange={handleChange}
                      className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <select
                      name="stopLossType"
                      value={formData.stopLossType}
                      onChange={handleChange}
                      className="w-1/2 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                    >
                      <option value="Intraday">Intraday</option>
                      <option value="Closing">Closing</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* add book profit price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Profit Price
              </label>
              <input
                type="number"
                name="bookProfitPrice"
                value={formData.bookProfitPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Section 3: Notes & Risk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analyst Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Add any specific instructions or analysis rationale here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 bg-red-50 p-4 rounded-lg border border-red-100">
              <input
                type="checkbox"
                name="isRisky"
                id="isRisky"
                checked={formData.isRisky}
                onChange={handleChange}
                className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <label
                htmlFor="isRisky"
                className="text-sm font-medium text-red-800 cursor-pointer"
              >
                Mark this trade as HIGH RISK
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              {/* <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-blue-100 outline-none"
              >
                {formData.sendMode === "DRAFT" ? "Save Draft" : "Publish Trade"}
              </button> */}
            </div>
          </form>
        </div>

        {/* Right Side: Preview Card (30%) */}
        <div className="w-full lg:w-[30%]">
          <div className="sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">
              Live Preview
            </h3>
            {/* The Preview Card automatically receives the real-time form state */}
            <PreviewCard formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveTrades;
