"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ position: "relative", background: "#1a0a0a", color: "#fff", overflow: "hidden" }}>

      {/* Gradient fade — blends page above into footer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Mandala — bottom left */}
      <div
        className="pointer-events-none select-none hidden md:block"
        style={{ position: "absolute", bottom: -60, left: -60, width: 280, opacity: 0.07, zIndex: 1 }}
      >
        <Image src="/mandala.webp" alt="" width={280} height={280} style={{ width: "100%", height: "auto", animation: "spin-slow 20s linear infinite" }} />
      </div>

      {/* Mandala — top right */}
      <div
        className="pointer-events-none select-none hidden md:block"
        style={{ position: "absolute", top: -40, right: -40, width: 200, opacity: 0.07, zIndex: 1 }}
      >
        <Image src="/mandala.webp" alt="" width={200} height={200} style={{ width: "100%", height: "auto", animation: "spin-slow 16s linear infinite reverse" }} />
      </div>

      {/* Gold top border line */}
      <div style={{ height: 3, background: "linear-gradient(to right, transparent, #D4A017, #FF6B35, #D4A017, transparent)", position: "relative", zIndex: 3 }} />

      <div className="relative" style={{ zIndex: 3 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-8">

          {/* Logo + tagline */}
          <div className="text-center mb-12">
            <h2
              className="font-nistha"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", color: "#D4A017", letterSpacing: "0.04em", textShadow: "0 2px 16px rgba(212,160,23,0.4)" }}
            >
              Crescendo&apos;26
            </h2>
            <p
              className="font-taiganja mt-2"
              style={{ color: "#FF6B35", fontSize: "clamp(0.85rem, 2vw, 1.1rem)", letterSpacing: "0.2em" }}
            >
              THE INDIAN ODYSSEY
            </p>
            <div style={{ height: 2, width: 80, background: "linear-gradient(to right, #8B1538, #D4A017, #8B1538)", margin: "12px auto 0" }} />
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

            {/* Navigate */}
            <div>
              <h4 style={{ color: "#D4A017", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: 16, textTransform: "uppercase" }}>Navigate</h4>
              <ul className="space-y-3">
                {([["#home","Home"],["#about","About"],["#events","Events"],["#faqs","FAQs"]] as [string,string][]).map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} style={{ color: "#c9a87c", fontSize: "0.9rem", fontFamily: "'Poppins',sans-serif", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#F7B32B")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#c9a87c")}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Fest */}
            <div>
              <h4 style={{ color: "#D4A017", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: 16, textTransform: "uppercase" }}>The Fest</h4>
              <ul className="space-y-3">
                {([["📅","6th – 9th April 2026"],["📍","VIT Campus, Vellore"],["🎭","Cultural & Technical"],["��","₹5L+ Prize Pool"]] as [string,string][]).map(([icon, text]) => (
                  <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "#c9a87c", fontSize: "0.9rem", fontFamily: "'Poppins',sans-serif" }}>
                    <span>{icon}</span><span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ color: "#D4A017", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: 16, textTransform: "uppercase" }}>Contact</h4>
              <ul className="space-y-3">
                {([["✉️","info@crescendo26.com"],["📞","+91 12345 67890"],["��","VIT University, Vellore"]] as [string,string][]).map(([icon, text]) => (
                  <li key={text} style={{ display: "flex", gap: 8, color: "#c9a87c", fontSize: "0.9rem", fontFamily: "'Poppins',sans-serif", alignItems: "flex-start" }}>
                    <span>{icon}</span><span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 style={{ color: "#D4A017", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: 16, textTransform: "uppercase" }}>Follow Us</h4>
              <div className="flex flex-col gap-3">
                {([["📸","Instagram","#"],["👥","Facebook","#"],["🐦","Twitter / X","#"],["▶️","YouTube","#"]] as [string,string,string][]).map(([icon, label, href]) => (
                  <a key={label} href={href}
                    style={{ display: "flex", alignItems: "center", gap: 8, color: "#c9a87c", fontSize: "0.9rem", fontFamily: "'Poppins',sans-serif", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#F7B32B")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#c9a87c")}>
                    <span>{icon}</span>{label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(212,160,23,0.4), transparent)", marginBottom: 24 }} />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p style={{ color: "#7a5c3a", fontSize: "0.8rem", fontFamily: "'Poppins',sans-serif", textAlign: "center" }}>
              © 2026 Crescendo — VIT&apos;s Inter-College Fest. All rights reserved.
            </p>
            <p style={{ color: "#7a5c3a", fontSize: "0.8rem", fontFamily: "'Poppins',sans-serif" }}>
              Made with ❤️ by the Crescendo Dev Team
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}