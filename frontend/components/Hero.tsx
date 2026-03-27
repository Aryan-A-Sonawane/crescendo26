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
        className="relative w-full overflow-hidden h-[78vh] md:h-[88vh]"
        style={{ backgroundColor: "#E7A92E" }}
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

        {/* Border corners — mobile */}
        <div
          className="absolute pointer-events-none select-none md:hidden"
          style={{ top: -6, left: -12, zIndex: 9999, width: 110 }}
        >
          <Image
            src="/border-corner.png"
            alt=""
            width={160}
            height={160}
            aria-hidden="true"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <div
          className="absolute pointer-events-none select-none md:hidden"
          style={{ top: -6, right: -12, zIndex: 9999, width: 110, transform: "scaleX(-1)" }}
        >
          <Image
            src="/border-corner.png"
            alt=""
            width={160}
            height={160}
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

        {/* Mobile decorative fillers */}
        <div
          className="absolute md:hidden pointer-events-none select-none"
          style={{ top: "18vh", left: "-26px", zIndex: 2, width: 180, opacity: 0.8 }}
        >
          <div style={{ animation: "slide-in-left 1s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
            <Image
              src="/auto.webp"
              alt=""
              width={180}
              height={140}
              aria-hidden="true"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>


        <div
          className="absolute md:hidden pointer-events-none select-none"
          style={{ top: "17vh", right: "-36px", zIndex: 2, width: 200, opacity: 0.8 }}
        >
          <div style={{ animation: "slide-in-right 1s cubic-bezier(0.22,1,0.36,1) 0.24s both" }}>
            <Image
              src="/sitar.webp"
              alt=""
              width={200}
              height={140}
              aria-hidden="true"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        <div
          className="absolute md:hidden pointer-events-none select-none"
          style={{ bottom: "13vh", left: "-26px", zIndex: 2, width: 180, opacity: 0.8 }}
        >
          <div style={{ animation: "slide-in-left 1.2s cubic-bezier(0.22,1,0.36,1) 0.34s both" }}>
            <Image
              src="/camel.webp"
              alt=""
              width={180}
              height={200}
              aria-hidden="true"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        <div
          className="absolute md:hidden pointer-events-none select-none"
          style={{ bottom: "12vh", right: "-50px", zIndex: 2, width: 200, opacity: 0.8 }}
        >
          <div style={{ animation: "slide-in-right 1.2s cubic-bezier(0.22,1,0.36,1) 0.38s both" }}>
            <Image
              src="/music_driver.webp"
              alt=""
              width={200}
              height={140}
              aria-hidden="true"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        <div
          className="absolute md:hidden pointer-events-none select-none"
          style={{ top: "14vh", right: "-24px", zIndex: 2, width: 120, opacity: 0.32 }}
        >
          <div style={{ animation: "slide-in-right 1s cubic-bezier(0.22,1,0.36,1) 0.16s both" }}>
            <Image
              src="/mandala.webp"
              alt=""
              width={150}
              height={150}
              aria-hidden="true"
              style={{ width: "100%", height: "auto", animation: "spin-slow 14s linear infinite" }}
            />
          </div>
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

        {/* Banner + logo stack — shared center so logo stays aligned with banner */}
        <div
          className="absolute top-[54%] md:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ zIndex: 3, width: "clamp(360px, 108vw, 1320px)" }}
        >
          <Image
            src="/banner.webp"
            alt=""
            width={1200}
            height={800}
            aria-hidden="true"
            style={{ width: "100%", height: "auto" }}
          />

          <div
            className="absolute inset-0 -translate-y-5 md:-translate-y-10 flex items-center justify-center select-none hero-banner-wrapper"
            style={{ zIndex: 4 }}
          >
            <div className="scale-90 md:scale-100" style={{ width: "clamp(270px, 74vw, 624px)" }}>
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
          </div>
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
          style={{ height: "clamp(130px, 23vh, 180px)", zIndex: 5, overflow: "hidden" }}
        >
          <div
            className="absolute left-0 w-full h-full -bottom-13 md:-bottom-19"
            style={{
              position: "absolute",
            }}
          >
            {/* Truck image */}
            <div
              className="w-50 md:w-70"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                animation: "truck-drive 10s linear infinite",
              }}
            >
              <Image
                src="/truck.webp"
                alt="Decorated Indian Truck"
                width={280}
                height={280}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              {/* Date label on the truck */}
              <div
                className="block px-1.5 py-2.5 text-[11px] md:px-2 md:py-4 md:text-base"
                style={{
                  position: "absolute",
                  top: "38%",
                  left: "31%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(139,21,56,0.88)",
                  border: "2px solid #D4A017",
                  borderRadius: 6,
                  whiteSpace: "nowrap",
                  color: "#F7B32B",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
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
