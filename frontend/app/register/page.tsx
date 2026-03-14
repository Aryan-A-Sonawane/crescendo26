"use client";

import { useEffect } from "react";
import Link from "next/link";

const TICKETS_URL = "https://learner.vierp.in/events";

export default function RegisterPage() {
  useEffect(() => {
    const ticketWindow = window.open(TICKETS_URL, "_blank", "noopener,noreferrer");
    if (ticketWindow) {
      ticketWindow.opener = null;
      window.location.replace("/onboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: "#f3ba35" }}>
      <h1 className="text-2xl font-bold mb-3" style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}>
        Opening Tickets...
      </h1>
      <p className="text-sm mb-6" style={{ color: "#7B2D0E" }}>
        If a new tab did not open, use the button below.
      </p>
      <a
        href={TICKETS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-bold text-sm px-8 py-3 rounded-full border-2 transition-all hover:scale-105 shadow-lg tracking-widest mb-3"
        style={{
          backgroundColor: "#D4A017",
          color: "#4a0e00",
          borderColor: "#8B1538",
          fontFamily: "'Cinzel Decorative', serif",
        }}
      >
        BUY TICKETS
      </a>
      <Link
        href="/onboard"
        className="inline-block font-bold text-sm px-8 py-3 rounded-full border-2 transition-all hover:scale-105 shadow-lg tracking-widest"
        style={{
          backgroundColor: "#8B1538",
          color: "#FFF8E7",
          borderColor: "#D4A017",
          fontFamily: "'Cinzel Decorative', serif",
        }}
      >
        CONTINUE TO ONBOARD
      </Link>
    </div>
  );
}
