"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Inline diya (oil lamp) flame — animated via keyframes in globals.css */
function Diya({ size = 22 }: { size?: number }) {
  const w = size;
  const h = Math.round(size * 1.45);
  return (
    <svg width={w} height={h} viewBox="0 0 20 29" fill="none" aria-hidden="true">
      <ellipse cx="10" cy="8" rx="4.5" ry="7"
        fill="#FF6B35"
        style={{ animation: "diya-flicker 1.7s ease-in-out infinite alternate", transformOrigin: "10px 15px" }}
      />
      <ellipse cx="10" cy="10" rx="2.2" ry="4"
        fill="#F7B32B"
        style={{ animation: "diya-flicker 1.1s ease-in-out infinite alternate-reverse", transformOrigin: "10px 15px" }}
      />
      <circle cx="10" cy="15" r="1" fill="#8B1538" />
      <path d="M3 17 Q10 21.5 17 17 L15.5 24 Q10 27.5 4.5 24 Z" fill="#b8780a" />
      <ellipse cx="10" cy="17" rx="7" ry="2.5" fill="#D4A017" />
      <ellipse cx="10" cy="17" rx="4" ry="1.3" fill="#c9a87c" opacity="0.7" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    link: "https://www.instagram.com/vit_pune_official",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    link: "https://youtube.com/@vitstudentactivities",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  }
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/#competitions", label: "Competitions" },
  { href: "/#about", label: "About" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/register", label: "Register" },
];

export default function Footer() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer style={{ position: "relative", background: "#110505", color: "#fff", overflow: "hidden" }}>

      {/* Gradient fade */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 90,
          background: "linear-gradient(to bottom, #f3ba35 0%, rgba(17,5,5,0) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Warli art frieze */}
      <div style={{ position: "relative", height: 56, overflow: "hidden", zIndex: 3 }}>
        <div style={{ display: "flex", width: "200vw", height: "100%", animation: "warli-scroll 32s linear infinite" }}>
          <div style={{ width: "100vw", height: "100%", backgroundImage: "url('/warli-painting.webp')", backgroundSize: "cover", backgroundPosition: "top center", opacity: 0.55, flexShrink: 0 }} />
          <div style={{ width: "100vw", height: "100%", backgroundImage: "url('/warli-painting.webp')", backgroundSize: "cover", backgroundPosition: "top center", opacity: 0.55, flexShrink: 0 }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,5,5,0) 0%, rgba(17,5,5,0.55) 100%)", pointerEvents: "none" }} />
      </div>

      {/* Gold rule */}
      <div style={{ height: 2, background: "linear-gradient(to right, transparent, #D4A017 25%, #FF6B35 50%, #D4A017 75%, transparent)", position: "relative", zIndex: 3 }} />

      {/* Background mandala */}
      <div
        className="pointer-events-none select-none"
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, opacity: 0.05, zIndex: 1, animation: "spin-slow 50s linear infinite" }}
      >
        <Image src="/mandala.webp" alt="" width={700} height={700} style={{ width: "100%", height: "auto" }} />
      </div>

      {/* Side mandala */}
      <div
        className="pointer-events-none select-none hidden lg:block"
        style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", width: 180, opacity: 0.12, zIndex: 2, animation: "spin-slow 30s linear infinite" }}
      >
        <Image src="/mandala.webp" alt="" width={180} height={180} style={{ width: "100%", height: "auto" }} />
      </div>

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        style={{
          position: "relative",
          zIndex: 3,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.85s ease, transform 0.85s ease",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-8 pb-5">

          {/* ── Two-column main row ── */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">

            {/* LEFT — Branding */}
            <div className="flex-shrink-0">
              <p style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "0.58rem", letterSpacing: "0.38em", color: "#FF6B35", textTransform: "uppercase", marginBottom: 5 }}>
                VIT Pune Presents
              </p>
              <h2
                className="font-nistha"
                style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "#D4A017", lineHeight: 1.05, textShadow: "0 0 48px rgba(212,160,23,0.3)" }}
              >
                Crescendo&apos;26
              </h2>
              <p
                className="font-taiganja"
                style={{ color: "#FF6B35", fontSize: "clamp(0.65rem, 1.6vw, 0.82rem)", letterSpacing: "0.28em", marginTop: 4 }}
              >
                THE INDIAN ODYSSEY
              </p>

              {/* Diya divider — compact */}
              <div className="flex items-center gap-2 mt-4 mb-3">
                <Diya size={13} />
                <span style={{ color: "#D4A017", fontSize: "0.7rem" }}>✦</span>
                <Diya size={17} />
                <span style={{ color: "#D4A017", fontSize: "0.7rem" }}>✦</span>
                <Diya size={13} />
              </div>

              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.72rem", color: "#c9a87c", letterSpacing: "0.08em" }}>
                6<sup>th</sup>–9<sup>th</sup> April 2026 &nbsp;·&nbsp; VIT, Pune
              </p>
            </div>

            {/* Vertical divider — desktop only */}
            <div
              className="hidden md:block flex-shrink-0"
              style={{ width: 1, alignSelf: "stretch", background: "linear-gradient(to bottom, transparent, rgba(212,160,23,0.35) 30%, rgba(212,160,23,0.35) 70%, transparent)" }}
            />

            {/* RIGHT — Navigate + Find Us */}
            <div className="flex gap-10 sm:gap-16 flex-1 justify-end">

              {/* Navigate */}
              <div>
                <h4 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#FF6B35", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
                  Navigate
                </h4>
                <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {NAV_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", color: "#c9a87c", textDecoration: "none", transition: "color 0.2s, padding-left 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#D4A017"; e.currentTarget.style.paddingLeft = "5px"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#c9a87c"; e.currentTarget.style.paddingLeft = "0"; }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Find Us */}
              <div>
                <h4 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#FF6B35", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
                  Find Us
                </h4>
                <ul style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {SOCIALS.map(({ label, link, icon }) => (
                    <li key={label}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#c9a87c", fontFamily: "'Poppins', sans-serif", fontSize: "0.78rem", textDecoration: "none", transition: "color 0.2s, transform 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#D4A017"; e.currentTarget.style.transform = "translateX(4px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#c9a87c"; e.currentTarget.style.transform = "translateX(0)"; }}
                      >
                        {icon}
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* ── Rangoli dot divider ── */}
          <div className="flex items-center justify-center gap-2 mt-7 mb-4">
            {(["#8B1538","#D4A017","#FF6B35","#F7B32B","#FF6B35","#D4A017","#8B1538"] as const).map((color, i) => {
              const mid = i === 3;
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width:  mid ? 9 : i % 2 === 0 ? 4 : 6,
                    height: mid ? 9 : i % 2 === 0 ? 4 : 6,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 ${mid ? 8 : 4}px ${color}`,
                    animation: `rangoli-pulse ${1.2 + i * 0.15}s ease-in-out infinite alternate`,
                  }}
                />
              );
            })}
          </div>

          {/* Copyright */}
          <p
            className="text-center"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.68rem", color: "#4a2a1a", letterSpacing: "0.04em" }}
          >
            © 2026 Crescendo &mdash; VIT&apos;s Inter-College Fest
          </p>

        </div>
      </div>

    </footer>
  );
}