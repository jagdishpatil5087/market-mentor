"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

const stockOptions = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "WIPRO",
  "SBIN",
  "BAJFINANCE",
  "AXISBANK",
  "KOTAKBANK",
  "TATAMOTORS",
  "MARUTI",
  "ADANIENT",
  "SUNPHARMA",
  "NTPC",
  "POWERGRID",
  "ONGC",
  "COALINDIA",
];

export default function TradeForm() {
  const first = useRef(null);

  const [form, setForm] = useState({
    stockName: "",
    tradeDirection: "",
    tradeCategory: "",
    minEntry: "",
    maxEntry: "",
    currentMarket: "",
    minTarget: "",
    maxTarget: "",
    stopLoss: "",
    stopLossType: "",
    notes: "",
    riskyTrade: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [stockSearch, setStockSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = stockOptions.filter((s) =>
    s.toLowerCase().includes(stockSearch.toLowerCase()),
  );

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.stockName) e.stockName = "Required";
    if (!form.tradeDirection) e.tradeDirection = "Required";
    if (!form.tradeCategory) e.tradeCategory = "Required";
    if (!form.minEntry) e.minEntry = "Required";
    if (!form.maxEntry) e.maxEntry = "Required";
    if (!form.currentMarket) e.currentMarket = "Required";
    if (!form.minTarget) e.minTarget = "Required";
    if (!form.maxTarget) e.maxTarget = "Required";
    if (!form.stopLoss) e.stopLoss = "Required";
    if (!form.stopLossType) e.stopLossType = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSubmitted(true);
  };

  const isBuy = form.tradeDirection === "BUY";
  const isSell = form.tradeDirection === "SELL";

  // Calculate P&L preview
  const entryMid =
    form.minEntry && form.maxEntry
      ? ((parseFloat(form.minEntry) + parseFloat(form.maxEntry)) / 2).toFixed(2)
      : null;
  const targetMid =
    form.minTarget && form.maxTarget
      ? ((parseFloat(form.minTarget) + parseFloat(form.maxTarget)) / 2).toFixed(
          2,
        )
      : null;
  const slPct =
    entryMid && form.stopLoss
      ? (
          ((parseFloat(form.stopLoss) - parseFloat(entryMid)) /
            parseFloat(entryMid)) *
          100
        ).toFixed(2)
      : null;
  const tgtPct =
    entryMid && targetMid
      ? (
          ((parseFloat(targetMid) - parseFloat(entryMid)) /
            parseFloat(entryMid)) *
          100
        ).toFixed(2)
      : null;

  const download = async () => {
    if (!first.current) return;

    try {
      const dataUrl = await toPng(first.current, {
        cacheBust: true,
        backgroundColor: "#111214", // important for dark UI
        pixelRatio: 2, // better quality
      });

      const link = document.createElement("a");
      link.download = "trade.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Image export failed", err);
    }
  };

  return (
    <div
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      className="min-h-screen bg-[#0e0f11] text-[#d4d4d4]"
    >
      {/* Header */}
      <div className="border-b border-[#1e2023] bg-[#111214]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#387ed1] rounded flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <div
                className="text-[13px] font-600 text-[#e8e8e8]"
                style={{ fontWeight: 600 }}
              >
                TradeBook
              </div>
              <div className="text-[10px] text-[#4a4d52] tracking-widest uppercase">
                Entry Setup
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#4a4d52]">
            <span>NSE / BSE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></div>
            <span className="text-[#22c55e]">LIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stock + Direction */}
            <div className="bg-[#111214] border border-[#1e2023] rounded-lg p-5">
              <div className="section-label">Instrument</div>
              <div className="grid grid-cols-2 gap-4">
                {/* Stock Name */}
                <div className="col-span-2 relative">
                  <label className="block text-[11px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                    Stock Name
                  </label>
                  <input
                    className={`field-input ${errors.stockName ? "error" : ""}`}
                    placeholder="Search symbol... e.g. RELIANCE"
                    value={stockSearch || form.stockName}
                    onChange={(e) => {
                      setStockSearch(e.target.value);
                      set("stockName", "");
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  />
                  {showDropdown && filtered.length > 0 && (
                    <div className="stock-drop">
                      {filtered.map((s) => (
                        <div
                          key={s}
                          className="stock-item"
                          onMouseDown={() => {
                            set("stockName", s);
                            setStockSearch(s);
                            setShowDropdown(false);
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.stockName && (
                    <span className="text-[10px] text-[#e84040] mt-1 block">
                      {errors.stockName}
                    </span>
                  )}
                </div>

                {/* Direction */}
                <div className="col-span-2">
                  <label className="block text-[11px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                    Trade Direction
                  </label>
                  <div className="flex gap-2">
                    {["BUY", "SELL"].map((d) => (
                      <button
                        key={d}
                        className={`direction-btn ${d.toLowerCase()} ${form.tradeDirection === d ? "active" : ""}`}
                        onClick={() => set("tradeDirection", d)}
                      >
                        {d === "BUY" ? "▲ " : "▼ "}
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.tradeDirection && (
                    <span className="text-[10px] text-[#e84040] mt-1 block">
                      {errors.tradeDirection}
                    </span>
                  )}
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <label className="block text-[11px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                    Trade Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Intraday",
                      "Swing",
                      "Positional",
                      "BTST",
                      "Options",
                      "Futures",
                    ].map((c) => (
                      <button
                        key={c}
                        className={`cat-btn ${form.tradeCategory === c ? "active" : ""}`}
                        onClick={() => set("tradeCategory", c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.tradeCategory && (
                    <span className="text-[10px] text-[#e84040] mt-1 block">
                      {errors.tradeCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Levels */}
            <div className="bg-[#111214] border border-[#1e2023] rounded-lg p-5">
              <div className="section-label">Price Levels</div>

              {/* Entry */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#387ed1]"></div>
                  <span
                    className="text-[11px] text-[#387ed1] uppercase tracking-wider font-600"
                    style={{ fontWeight: 600 }}
                  >
                    Entry Zone
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                      Min Entry ₹
                    </label>
                    <input
                      type="number"
                      className={`field-input ${errors.minEntry ? "error" : ""}`}
                      placeholder="0.00"
                      value={form.minEntry}
                      onChange={(e) => set("minEntry", e.target.value)}
                    />
                    {errors.minEntry && (
                      <span className="text-[10px] text-[#e84040] mt-1 block">
                        {errors.minEntry}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                      Max Entry ₹
                    </label>
                    <input
                      type="number"
                      className={`field-input ${errors.maxEntry ? "error" : ""}`}
                      placeholder="0.00"
                      value={form.maxEntry}
                      onChange={(e) => set("maxEntry", e.target.value)}
                    />
                    {errors.maxEntry && (
                      <span className="text-[10px] text-[#e84040] mt-1 block">
                        {errors.maxEntry}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                      Market Price ₹
                    </label>
                    <input
                      type="number"
                      className={`field-input ${errors.currentMarket ? "error" : ""}`}
                      placeholder="0.00"
                      value={form.currentMarket}
                      onChange={(e) => set("currentMarket", e.target.value)}
                    />
                    {errors.currentMarket && (
                      <span className="text-[10px] text-[#e84040] mt-1 block">
                        {errors.currentMarket}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Target */}
              <div className="my-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></div>
                  <span
                    className="text-[11px] text-[#22c55e] uppercase tracking-wider font-600"
                    style={{ fontWeight: 600 }}
                  >
                    Target Zone
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                      Min Target ₹
                    </label>
                    <input
                      type="number"
                      className={`field-input ${errors.minTarget ? "error" : ""}`}
                      placeholder="0.00"
                      value={form.minTarget}
                      onChange={(e) => set("minTarget", e.target.value)}
                    />
                    {errors.minTarget && (
                      <span className="text-[10px] text-[#e84040] mt-1 block">
                        {errors.minTarget}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                      Max Target ₹
                    </label>
                    <input
                      type="number"
                      className={`field-input ${errors.maxTarget ? "error" : ""}`}
                      placeholder="0.00"
                      value={form.maxTarget}
                      onChange={(e) => set("maxTarget", e.target.value)}
                    />
                    {errors.maxTarget && (
                      <span className="text-[10px] text-[#e84040] mt-1 block">
                        {errors.maxTarget}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Stop Loss */}
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div>
                  <span
                    className="text-[11px] text-[#ef4444] uppercase tracking-wider font-600"
                    style={{ fontWeight: 600 }}
                  >
                    Stop Loss
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                      SL Price ₹
                    </label>
                    <input
                      type="number"
                      className={`field-input ${errors.stopLoss ? "error" : ""}`}
                      placeholder="0.00"
                      value={form.stopLoss}
                      onChange={(e) => set("stopLoss", e.target.value)}
                    />
                    {errors.stopLoss && (
                      <span className="text-[10px] text-[#e84040] mt-1 block">
                        {errors.stopLoss}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                      SL Type
                    </label>
                    <select
                      className={`field-input ${errors.stopLossType ? "error" : ""}`}
                      value={form.stopLossType}
                      onChange={(e) => set("stopLossType", e.target.value)}
                      style={{ appearance: "none", cursor: "pointer" }}
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      {[
                        "Fixed",
                        "Trailing",
                        "ATR Based",
                        "Candle Close",
                        "Structure Based",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.stopLossType && (
                      <span className="text-[10px] text-[#e84040] mt-1 block">
                        {errors.stopLossType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes + Risky */}
            <div className="bg-[#111214] border border-[#1e2023] rounded-lg p-5">
              <div className="section-label">Additional Info</div>
              <div className="mb-4">
                <label className="block text-[11px] text-[#4a4d52] mb-2 uppercase tracking-wider">
                  Reason / Notes
                </label>
                <textarea
                  className="field-input"
                  rows={3}
                  placeholder="Trade rationale, setup description, key levels to watch..."
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  style={{ resize: "vertical", minHeight: 80 }}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0e0f11] rounded border border-[#1e2023]">
                <div>
                  <div
                    className="text-[12px] text-[#d4d4d4] mb-0.5"
                    style={{ fontWeight: 500 }}
                  >
                    Risky Trade
                  </div>
                  <div className="text-[10px] text-[#4a4d52]">
                    Flag this trade as high-risk
                  </div>
                </div>
                <button
                  className={`toggle ${form.riskyTrade ? "on" : ""}`}
                  onClick={() => set("riskyTrade", !form.riskyTrade)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className={`submit-btn ${isBuy ? "submit-buy" : isSell ? "submit-sell" : "submit-default"}`}
              onClick={download}
            >
              dowload
            </button>
          </div>

          {/* Sidebar: Live Preview */}
          <div className="space-y-4">
            {/* Risk Preview */}
            <div
              ref={first}
              className="bg-[#111214] border border-[#1e2023] rounded-lg p-5 sticky top-6"
            >
              {form.stockName ? (
                <div className="mb-4">
                  <div
                    className="text-[18px] font-700 text-[#e8e8e8] mb-1"
                    style={{ fontWeight: 700 }}
                  >
                    {form.stockName}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {form.tradeDirection && (
                      <span
                        className={`tag ${form.tradeDirection === "BUY" ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e] border border-[rgba(34,197,94,0.3)]" : "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.3)]"}`}
                      >
                        {form.tradeDirection}
                      </span>
                    )}
                    {form.tradeCategory && (
                      <span className="tag bg-[rgba(56,126,209,0.12)] text-[#387ed1] border border-[rgba(56,126,209,0.3)]">
                        {form.tradeCategory}
                      </span>
                    )}
                    {form.riskyTrade && (
                      <span className="tag bg-[rgba(239,68,68,0.08)] text-[#ef4444] border border-[rgba(239,68,68,0.2)]">
                        ⚠ RISKY
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-[12px] text-[#2d2f33] mb-4">
                  Select a stock
                </div>
              )}

              <div className="space-y-1">
                {[
                  {
                    label: "Entry Range",
                    value:
                      form.minEntry && form.maxEntry
                        ? `₹${form.minEntry} – ₹${form.maxEntry}`
                        : "—",
                    color: "#387ed1",
                  },
                  {
                    label: "CMP",
                    value: form.currentMarket ? `₹${form.currentMarket}` : "—",
                    color: "#d4d4d4",
                  },
                  {
                    label: "Target Range",
                    value:
                      form.minTarget && form.maxTarget
                        ? `₹${form.minTarget} – ₹${form.maxTarget}`
                        : "—",
                    color: "#22c55e",
                  },
                  {
                    label: "Stop Loss",
                    value: form.stopLoss ? `₹${form.stopLoss}` : "—",
                    color: "#ef4444",
                  },
                ].map((row) => (
                  <div key={row.label} className="preview-row">
                    <span className="text-[11px] text-[#dcdcdc]">
                      {row.label}
                    </span>
                    <span
                      className="text-[12px]"
                      style={{ color: row.color, fontWeight: 500 }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Risk/Reward */}
              {entryMid && targetMid && form.stopLoss && (
                <div className="mt-4 pt-4 border-t border-[#1e2023]">
                  <div className="section-label">Risk / Reward</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] rounded p-3 text-center">
                      <div className="text-[10px] text-[#4a4d52] mb-1 uppercase tracking-wider">
                        Risk
                      </div>
                      <div
                        className="text-[14px] text-[#ef4444]"
                        style={{ fontWeight: 600 }}
                      >
                        {Math.abs(slPct)}%
                      </div>
                    </div>
                    <div className="bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.15)] rounded p-3 text-center">
                      <div className="text-[10px] text-[#4a4d52] mb-1 uppercase tracking-wider">
                        Reward
                      </div>
                      <div
                        className="text-[14px] text-[#22c55e]"
                        style={{ fontWeight: 600 }}
                      >
                        {tgtPct}%
                      </div>
                    </div>
                  </div>
                  {slPct && tgtPct && (
                    <div className="mt-3 p-2.5 bg-[#0e0f11] rounded border border-[#1e2023] text-center">
                      <span className="text-[10px] text-[#4a4d52] uppercase tracking-wider">
                        R:R Ratio{" "}
                      </span>
                      <span
                        className="text-[13px] text-[#e8e8e8] ml-1"
                        style={{ fontWeight: 600 }}
                      >
                        1 :{" "}
                        {(
                          Math.abs(parseFloat(tgtPct)) /
                          Math.abs(parseFloat(slPct))
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {form.notes && (
                <div className="mt-4 pt-4 border-t border-[#1e2023]">
                  <div className="text-[10px] text-[#4a4d52] uppercase tracking-wider mb-3">
                    Notes
                  </div>
                  <div className="text-[12px] text-[#d4d4d4]">
                    <p>{form.notes}</p>
                  </div>
                </div>
              )}

              {/* Visual bar */}
              {form.stopLoss &&
                form.currentMarket &&
                (form.minTarget || form.maxTarget) && (
                  <div className="mt-4 pt-4 border-t border-[#1e2023]">
                    <div className="text-[10px] text-[#4a4d52] uppercase tracking-wider mb-3">
                      Price Map
                    </div>
                    <div className="relative h-1.5 bg-[#1e2023] rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#ef4444] rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                      <div
                        className="absolute left-[20%] top-0 h-full bg-[#387ed1] rounded-full"
                        style={{ width: "40%" }}
                      ></div>
                      <div
                        className="absolute left-[60%] top-0 h-full bg-[#22c55e] rounded-full"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[9px] text-[#ef4444]">SL</span>
                      <span className="text-[9px] text-[#387ed1]">Entry</span>
                      <span className="text-[9px] text-[#22c55e]">Target</span>
                    </div>
                  </div>
                )}
            </div>

            {/* SL Type Info */}
            {form.stopLossType && (
              <div className="bg-[#111214] border border-[#1e2023] rounded-lg p-4">
                <div className="text-[10px] text-[#4a4d52] uppercase tracking-wider mb-2">
                  SL Method
                </div>
                <div
                  className="text-[12px] text-[#387ed1]"
                  style={{ fontWeight: 500 }}
                >
                  {form.stopLossType}
                </div>
                <div className="text-[11px] text-[#4a4d52] mt-1">
                  {
                    {
                      Fixed: "Static price level, does not move.",
                      Trailing: "Follows price, locks in profits.",
                      "ATR Based": "Volatility-adjusted stop loss.",
                      "Candle Close": "Exits on candle close below SL.",
                      "Structure Based": "Based on key chart structure.",
                    }[form.stopLossType]
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e2023] mt-8 py-4 text-center">
        <span className="text-[10px] text-[#2d2f33] tracking-widest uppercase">
          TradeBook · For Educational & Tracking Purposes Only
        </span>
      </div>
    </div>
  );
}
