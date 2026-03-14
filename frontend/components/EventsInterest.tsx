"use client";

import { useState } from "react";
import { EVENT_CATEGORIES } from "@/lib/events";

interface Props {
  email: string;
  name: string;
  /** Called after successful save OR after the user skips */
  onComplete: (skipped?: boolean) => void;
}

export default function EventsInterest({ email, name, onComplete }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggle = (event: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(event)) next.delete(event);
      else next.add(event);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests: Array.from(selected) }),
      });
      if (!res.ok) {
        setError("Failed to save. Please try again.");
        return;
      }
      setSubmitted(true);
      setTimeout(() => onComplete(), 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="text-5xl">🎊</div>
        <p className="text-xl font-bold" style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}>
          Interests Saved!
        </p>
        <p className="text-sm" style={{ color: "#7B2D0E" }}>
          Our team will reach out to you with event updates.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="text-3xl mb-2">🎊</div>
        <h2
          className="text-xl font-bold leading-tight"
          style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}
        >
          You&apos;re in, {name.split(" ")[0]}!
        </h2>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "#7B2D0E" }}>
          Select events you&apos;d like to participate in.
          <br />
          Our publicity team will reach out with details!
        </p>
      </div>

      {/* Category cards */}
      <div className="space-y-4">
        {EVENT_CATEGORIES.map((cat) => (
          <div
            key={cat.category}
            className="rounded-2xl p-4 border-2"
            style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,255,255,0.65)" }}
          >
            <h3
              className="font-bold text-sm mb-3 flex items-center gap-2"
              style={{ color: cat.color }}
            >
              <span className="text-base">{cat.emoji}</span>
              <span style={{ fontFamily: "'Cinzel Decorative', serif" }}>{cat.category}</span>
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {cat.events.map((event) => {
                const checked = selected.has(event);
                return (
                  <label
                    key={event}
                    className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg transition-colors select-none"
                    style={{
                      backgroundColor: checked ? "rgba(212,160,23,0.2)" : "transparent",
                      border: `1px solid ${checked ? "#D4A017" : "transparent"}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(event)}
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ accentColor: "#8B1538" }}
                    />
                    <span className="text-xs font-medium leading-tight" style={{ color: "#3a0a00" }}>
                      {event}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected count badge */}
      {selected.size > 0 && (
        <p className="text-center text-xs font-bold mt-3" style={{ color: "#8B1538" }}>
          {selected.size} event{selected.size !== 1 ? "s" : ""} selected
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-700 text-xs font-bold text-center mt-2">{error}</p>
      )}

      {/* Action buttons */}
      <div className="mt-5 space-y-2.5">
        <button
          onClick={handleSubmit}
          disabled={loading || selected.size === 0}
          className="w-full font-bold text-sm py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg tracking-widest disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            backgroundColor: "#8B1538",
            color: "#FFF8E7",
            borderColor: "#D4A017",
            fontFamily: "'Cinzel Decorative', serif",
          }}
        >
          {loading ? "SAVING..." : `CONFIRM SELECTION`}
        </button>
        <button
          onClick={() => onComplete(true)}
          disabled={loading}
          className="w-full text-xs font-bold py-1.5 transition-all hover:underline disabled:opacity-50"
          style={{ color: "#7B2D0E", background: "none", border: "none" }}
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
}
