"use client";

/**
 * Slide-in keyframes (slideInLeft / slideInRight) are defined in app/globals.css.
 * Z-index layers:
 *   css bg → background color #E7A92E (behind everything)
 *   0 → border_left-removebg-preview.png decorative border frame
 *   1 → banner.webp (centered, behind decoratives)
 *   2 → decorative elements (mandala, truck, camel, sitar, gramophone)
 *   3 → crescendo.png (primary focus)
 *   10 → Border_top-removebg-preview.png (top strip, above all)
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MusicVisualizer from "./MusicVisualizer";

export default function Hero() {
  const sitarRef = useRef<HTMLDivElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const equalizerBars = Array.from({ length: 56 }, (_, i) => {
    const baseHeight = 50 + Math.round((Math.sin(i * 0.52) + 1) * 20) + (i % 5) * 4;
    const duration = 1.2 + (i % 7) * 0.12;
    const delay = (i % 9) * 0.08;
    return { id: i, baseHeight, duration, delay };
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Sitar: move at 40% of scroll speed (parallax depth)
      if (sitarRef.current) {
        sitarRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Hero section — 88vh gives enough room to separate decoratives ── */}
      <section
        id="home"
        className="relative w-full overflow-hidden"
        style={{ height: "88vh", backgroundColor: "#E7A92E" }}
      >

        {/* Border Corner — top-left — desktop only */}
        <div
          className="absolute pointer-events-none select-none hidden md:block"
          style={{ top: -10, left: -16, zIndex: 9999, width: "clamp(220px, 14vw, 200px)" }}
        >
          <Image
            src="/border-corner.png"
            alt=""
            width={300}
            height={300}
            aria-hidden="true"
            style={{ width: "100%", height: "auto" }}
          />
        </div>


        {/* Border Corner — top-right (flipped) — desktop only */}
        <div
          className="absolute pointer-events-none select-none hidden md:block"
          style={{ top: -10, right: -16, zIndex: 9999, width: "clamp(225px, 14vw, 200px)", transform: "scaleX(-1)" }}
        >
          <Image
            src="/border-corner.png"
            alt=""
            width={500}
            height={300}
            aria-hidden="true"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Top Border Strip — desktop only */}
        <div
          className="absolute pointer-events-none select-none overflow-hidden hidden md:flex"
          style={{
            top: 0,
            left: "clamp(120px, 14vw, 200px)",
            right: "clamp(120px, 14vw, 200px)",
            height: 105,
            zIndex: 9999,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            /* Each tile: show only 3/4 of the image width, crop the rest */
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: 700,
                height: 105,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src="/border_1.png"
                alt=""
                width={214}
                height={1076}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 105,
                  height: 700,
                  transform: "translate(-50%, -50%) rotate(90deg)",
                  maxWidth: "none",
                }}
              />
            </div>
          ))}
        </div>


        {/* Auto — top-left, where truck used to be — z-2 — hidden on mobile */}
        <div
          className="absolute hidden md:block pointer-events-none select-none"
          style={{ top: "16vh", left: "-12px", zIndex: 2, width: "clamp(320px, 20vw, 300px)" }}
        >
          <div style={{ animation: "slide-in-left 1s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
            <Image
              src="/auto.webp"
              alt="Decorated Auto"
              width={400}
              height={320}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        {/* Mandala — top-right corner — desktop only */}
        <div
          className="absolute pointer-events-none select-none hidden md:block"
          style={{ top: "18vh", right: "0%", zIndex: 2, width: "clamp(360px, 14vw, 240px)", opacity: 0.45 }}
        >
          <Image
            src="/mandala.webp"
            alt=""
            width={300}
            height={300}
            aria-hidden="true"
            style={{ width: "100%", height: "auto", animation: "spin-slow 12s linear infinite" }}
          />
        </div>



        {/* Camel — bottom-left, flush with section bottom — z-2 — hidden on mobile */}
        <div
          className="absolute hidden md:block pointer-events-none select-none"
          style={{ bottom: 0, left: "-12px", zIndex: 4, width: "clamp(380px, 24vw, 360px)", animation: "slide-in-left 1.2s cubic-bezier(0.22,1,0.36,1) 0.55s both" }}
        >
          <Image
            src="/camel.webp"
            alt="Decorated Camel"
            width={460}
            height={400}  
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Sitar — just below border, top-right — desktop only */}
        <div
          ref={sitarRef}
          className="absolute pointer-events-none select-none hidden md:block"
          style={{ top: "18vh", right: "-100px", zIndex: 2, width: "clamp(440px, 22vw, 320px)", willChange: "transform" }}
        >
          <div style={{ animation: "slide-in-right 1s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
            <Image
              src="/sitar.webp"
              alt="Classical instruments"
              width={420}
              height={380}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        {/* Gramophone — bottom-right — desktop only */}
        <div
          className="absolute pointer-events-none select-none hidden md:block"
          style={{ bottom: -40, right: "-72px", zIndex: 2, width: "clamp(340px, 20vw, 320px)", animation: "slide-in-right 1.2s cubic-bezier(0.22,1,0.36,1) 0.55s both" }}
        >
          <Image
            src="/music_driver.webp"
            alt="Gramophone"
            width={420}
            height={380}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* banner.webp — behind all decoratives and logo, centered — z-1 */}
        <div
          className="absolute top-[51%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ zIndex: 3, width: "min(98vw, 1320px)" }}
        >
          <Image
            src="/banner.webp"
            alt=""
            width={1200}
            height={800}
            aria-hidden="true"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Crescendo logo — centered, 40–50% width — z-3 */}
        <div
          className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 select-none hero-banner-wrapper"
          style={{ zIndex: 4, width: "min(67.2vw, 624px)" }}
        >
          <Image
            src="/crescendo.png"
            alt="Crescendo: The Indian Odyssey"
            width={900}
            height={450}
            priority
            style={{
              width: "100%",
              height: "auto",
              filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.25))",
              transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.26)";
              (e.currentTarget as HTMLImageElement).style.filter = "drop-shadow(0 16px 35px rgba(0,0,0,0.35))";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLImageElement).style.filter = "drop-shadow(0 10px 25px rgba(0,0,0,0.25))";
            }}
          />
        </div>

        {/* Music controls — centered below crescendo logo */}
        <MusicVisualizer onPlaybackChange={setIsMusicPlaying} />

        {/* Retro equalizer bars — desktop only, subtle and behind the truck */}
        <div
          className="absolute bottom-0 hidden md:flex items-end pointer-events-none select-none"
          style={{
            left: "clamp(90px, 11vw, 150px)",
            right: "clamp(90px, 11vw, 150px)",
            height: "clamp(170px, 26vh, 240px)",
            zIndex: 1,
            gap: 5,
            opacity: 0.75,
          }}
          aria-hidden="true"
        >
          {equalizerBars.map((bar) => (
            <div
              key={bar.id}
              style={{
                flex: 1,
                minWidth: 4,
                height: `${bar.baseHeight}px`,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                background:
                  "linear-gradient(180deg, rgba(212,160,23,0.55) 0%, rgba(139,21,56,0.42) 52%, rgba(107,15,26,0.32) 100%)",
                boxShadow: "0 0 10px rgba(212,160,23,0.22)",
                transformOrigin: "bottom",
                animation: `retro-eq-pulse ${bar.duration}s ease-in-out ${bar.delay}s infinite alternate`,
                animationPlayState: isMusicPlaying ? "running" : "paused",
              }}
            />
          ))}
        </div>

        {/* Truck lane — lowered so it runs right above the existing warli band */}
        <div
          className="absolute bottom-0 left-0 w-full pointer-events-none select-none"
          style={{ height: 180, zIndex: 5, overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -70,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {/* Truck image */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                animation: "truck-drive 10s linear infinite",
                width: 280,
                
              }}
            >
              <Image
                src="/truck.webp"
                alt="Decorated Indian Truck"
                width={280}
                height={280}
                style={{ width: 280, height: "280", display: "block" }}
              />
              {/* Date label on the truck */}
              <div
                style={{
                  position: "absolute",
                  top: "38%",
                  left: "31%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(139,21,56,0.88)",
                  border: "2px solid #D4A017",
                  borderRadius: 6,
                  padding: "16px 8px",
                  whiteSpace: "nowrap",
                  color: "#F7B32B",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  letterSpacing: "0.04em",
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                6th – 9th April
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Bottom maroon section removed — About section starts immediately */}

    </>
  );
}
