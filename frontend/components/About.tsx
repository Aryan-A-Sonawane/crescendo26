"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Floating petal / particle for mobile background ─── */
function FloatingPetal({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        width: 10,
        height: 10,
        borderRadius: "50% 0 50% 0",
        background: "rgba(255,181,29,0.55)",
        ...style,
      }}
    />
  );
}

/* ─── Animated rangoli dot row ─── */
function RangoliDots() {
  const colors = ["#8B1538", "#D4A017", "#FF6B35", "#F7B32B", "#FF6B35", "#D4A017", "#8B1538"];
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 7, margin: "10px 0" }}>
      {colors.map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: i === 3 ? 12 : i % 2 === 0 ? 5 : 8,
            height: i === 3 ? 12 : i % 2 === 0 ? 5 : 8,
            borderRadius: "50%",
            background: c,
            boxShadow: `0 0 ${i === 3 ? 10 : 5}px ${c}`,
            animation: `rangoli-pulse ${1.2 + i * 0.15}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Corner rangoli SVG ornament ─── */
function CornerOrnament({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="64" height="64" viewBox="0 0 64 64" fill="none"
      style={{ transform: flip ? "scaleX(-1)" : undefined, opacity: 0.7 }}
    >
      <path d="M4 4 Q32 4 60 32 Q32 60 4 60 Q4 32 4 4Z" stroke="#D4A017" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M4 4 L20 4 Q4 4 4 20Z" fill="#FF6B35" opacity="0.6" />
      <circle cx="4" cy="4" r="3" fill="#F7B32B" />
      <circle cx="20" cy="4" r="2" fill="#D4A017" />
      <circle cx="4" cy="20" r="2" fill="#D4A017" />
      <path d="M4 4 Q14 10 20 4" stroke="#FF6B35" strokeWidth="1.5" fill="none" />
      <path d="M4 4 Q10 14 4 20" stroke="#FF6B35" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill="#F7B32B" opacity="0.8" />
    </svg>
  );
}

/* ─── Diya flame ─── */
function Diya({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.45)} viewBox="0 0 20 29" fill="none" aria-hidden="true">
      <ellipse cx="10" cy="8" rx="4.5" ry="7" fill="#FF6B35"
        style={{ animation: "diya-flicker 1.7s ease-in-out infinite alternate", transformOrigin: "10px 15px" }} />
      <ellipse cx="10" cy="10" rx="2.2" ry="4" fill="#F7B32B"
        style={{ animation: "diya-flicker 1.1s ease-in-out infinite alternate-reverse", transformOrigin: "10px 15px" }} />
      <circle cx="10" cy="15" r="1" fill="#8B1538" />
      <path d="M3 17 Q10 21.5 17 17 L15.5 24 Q10 27.5 4.5 24 Z" fill="#b8780a" />
      <ellipse cx="10" cy="17" rx="7" ry="2.5" fill="#D4A017" />
      <ellipse cx="10" cy="17" rx="4" ry="1.3" fill="#c9a87c" opacity="0.7" />
    </svg>
  );
}

export default function About() {
  const mobileTextRef = useRef<HTMLDivElement>(null);
  const [mobileVisible, setMobileVisible] = useState(false);

  useEffect(() => {
    const el = mobileTextRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMobileVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* petals scattered around mobile bg */
  const petals = [
    { top: "8%",  left: "7%",  animationDelay: "0s",    animationDuration: "5s",  transform: "rotate(15deg)"  },
    { top: "14%", right: "9%", animationDelay: "0.8s",  animationDuration: "6s",  transform: "rotate(-30deg)" },
    { top: "30%", left: "4%",  animationDelay: "1.5s",  animationDuration: "4.5s",transform: "rotate(45deg)"  },
    { top: "55%", right: "5%", animationDelay: "0.3s",  animationDuration: "7s",  transform: "rotate(-10deg)" },
    { top: "72%", left: "10%", animationDelay: "2s",    animationDuration: "5.5s",transform: "rotate(60deg)"  },
    { top: "85%", right: "12%",animationDelay: "1.1s",  animationDuration: "4s",  transform: "rotate(20deg)"  },
    { top: "42%", left: "3%",  animationDelay: "0.6s",  animationDuration: "6.5s",transform: "rotate(-45deg)" },
    { top: "65%", right: "8%", animationDelay: "1.8s",  animationDuration: "5.2s",transform: "rotate(35deg)"  },
  ];

  return (
    <>
      {/* ── Inject mobile-only keyframes ── */}
      <style>{`
        @keyframes petal-float {
          0%   { transform: translateY(0px) rotate(var(--r, 0deg)) scale(1);   opacity: 0.55; }
          50%  { transform: translateY(-18px) rotate(calc(var(--r, 0deg) + 20deg)) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(var(--r, 0deg)) scale(1);   opacity: 0.55; }
        }
        @keyframes glow-pulse {
          0%   { box-shadow: 0 0 18px 4px rgba(212,160,23,0.35); }
          100% { box-shadow: 0 0 36px 10px rgba(255,107,53,0.55); }
        }
        @keyframes title-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes disc-entry {
          from { opacity: 0; transform: scale(0.7) rotate(-30deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes border-dance {
          0%,100% { border-color: #D4A017; }
          33%     { border-color: #FF6B35; }
          66%     { border-color: #F7B32B; }
        }
        @keyframes diya-flicker {
          0%   { transform: scaleX(1)   scaleY(1);   }
          100% { transform: scaleX(0.88) scaleY(1.08); }
        }
        @keyframes rangoli-pulse {
          from { transform: scale(1);   opacity: 0.7; }
          to   { transform: scale(1.35); opacity: 1;   }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes warli-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes gold-border-spin {
          0%   { transform: rotate(0deg);   opacity: 0.6; }
          100% { transform: rotate(360deg); opacity: 0.9; }
        }
      `}</style>

      <section
        id="about"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #9f3026 0%, #110206 100%)", minHeight: "100vh", padding: 0, margin: 0 }}
      >

        {/* ══════════════════════════════════════════════
            WARLI SCROLLING BAND — shared desktop + mobile
        ══════════════════════════════════════════════ */}
        <div
          className="w-full overflow-hidden"
          style={{ position: "relative", zIndex: 10, backgroundColor: "#5a1a0e", height: 160, display: "flex", alignItems: "center" }}
        >
          <div style={{ display: "flex", width: "max-content", animation: "warli-scroll 18s linear infinite" }}>
            {[...Array(8)].map((_, i) => (
              <Image key={i} src="/warli-painting.jpg" alt="warli dancers" width={566} height={164}
                className="object-cover" style={{ flexShrink: 0, opacity: 0.92 }} priority={i === 0} />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            DESKTOP VIEW  (md and up) — unchanged
        ══════════════════════════════════════════════ */}
        <div
          className="hidden md:flex relative flex-col md:flex-row items-center h-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 gap-0"
          style={{ zIndex: 4, minHeight: "100vh" }}
        >
          <div className="flex flex-col justify-center shrink-0 md:w-1/2 pt-8 md:pt-0" style={{ zIndex: 6 }}>
            <h2 className="font-taiganja text-white leading-tight text-center md:text-left"
              style={{ fontSize: "clamp(2.2rem, 8vw, 6.5rem)" }}>
              What is
            </h2>
            <h1 className="font-nistha leading-none text-center md:text-left"
              style={{ fontSize: "clamp(3rem, 12vw, 8rem)", color: "#ffb51d", textShadow: "2px 2px 8px rgba(0,0,0,0.4)" }}>
              Crescendo?
            </h1>
          </div>

          <div className="hidden md:flex shrink-0 items-center justify-start w-full md:w-auto"
            style={{ zIndex: 5, width: "100%", marginLeft: "0", marginTop: "2rem" }}>
            <div className="relative w-full md:w-[90%] md:-ml-[20%]">
              <Image src="/radio.webp" alt="radio" width={1400} height={1050}
                className="object-contain w-full" style={{ opacity: 0.3 }} />
              <div className="speaker-spin absolute pointer-events-none"
                style={{ width: "23%", aspectRatio: "1", bottom: "22.5%", left: "10%", opacity: 0.3 }}>
                <Image src="/disc.webp" alt="left speaker wheel" fill className="object-contain" />
              </div>
              <div className="speaker-spin-reverse absolute pointer-events-none"
                style={{ width: "23%", aspectRatio: "1", bottom: "22.5%", right: "10%", opacity: 0.3 }}>
                <Image src="/disc.webp" alt="right speaker wheel" fill className="object-contain" />
              </div>
              <div className="absolute inset-0 flex items-center justify-start px-16 sm:px-20 md:px-40 lg:px-52 xl:px-60">
                <p style={{ color: "#ffd21f", fontStyle: "italic", fontSize: "clamp(0.75rem, 1.4vw, 1.1rem)",
                  textAlign: "justify", textShadow: "1px 1px 4px rgba(0,0,0,0.7)", lineHeight: "1.5" }}>
                  Crescendo is VIT&apos;s inter-college fest that brings together students from different
                  institutions to celebrate talent, creativity, and competition.&nbsp;
                  Crescendo is not just a fest, but an experience filled with energy, innovation,
                  performances, and unforgettable campus moments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            MOBILE VIEW  (below md) — full redesign
        ══════════════════════════════════════════════ */}
        <div className="block md:hidden relative" style={{ minHeight: "100vh", overflow: "hidden" }}>

          {/* ── Deep layered background ── */}
          {/* Radial glow centres */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(255,107,53,0.18) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 85%, rgba(212,160,23,0.13) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

          {/* Noise texture overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", opacity: 0.4, zIndex: 0, pointerEvents: "none" }} />

          {/* Big faint background mandala */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "110vw", aspectRatio: "1", opacity: 0.06, zIndex: 1, animation: "spin-slow 55s linear infinite", pointerEvents: "none" }}>
            <Image src="/mandala.webp" alt="" fill className="object-contain" />
          </div>

          {/* Floating petals */}
          {petals.map((p, i) => (
            <FloatingPetal
              key={i}
              style={{
                ...p,
                animation: `petal-float ${p.animationDuration} ease-in-out infinite`,
                animationDelay: p.animationDelay,
                zIndex: 2,
              }}
            />
          ))}

          {/* ── Content stack ── */}
          <div
            ref={mobileTextRef}
            style={{
              position: "relative",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "2.5rem",
              paddingBottom: "3rem",
              paddingLeft: "1.25rem",
              paddingRight: "1.25rem",
              gap: 0,
            }}
          >

            {/* Corner ornaments */}
            <div style={{ position: "absolute", top: 16, left: 12, zIndex: 8 }}><CornerOrnament /></div>
            <div style={{ position: "absolute", top: 16, right: 12, zIndex: 8 }}><CornerOrnament flip /></div>


            {/* "What is" */}
            <h2
              className="font-taiganja text-white text-center leading-tight"
              style={{
                fontSize: "clamp(2rem, 10vw, 3.2rem)",
                opacity: mobileVisible ? 1 : 0,
                transform: mobileVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s",
              }}
            >
              What is
            </h2>

            {/* CRESCENDO? — shimmer title */}
            <h1
              className="font-nistha text-center leading-none"
              style={{
                fontSize: "clamp(3.2rem, 16vw, 5.5rem)",
                background: "linear-gradient(90deg, #D4A017 0%, #FF6B35 25%, #F7B32B 50%, #FF6B35 75%, #D4A017 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: mobileVisible ? "title-shimmer 4s linear infinite" : "none",
                textShadow: "none",
                filter: "drop-shadow(0 0 12px rgba(255,181,29,0.5))",
                marginTop: 2,
                opacity: mobileVisible ? 1 : 0,
                transition: "opacity 0.7s ease 0.3s",
              }}
            >
              Crescendo?
            </h1>

            <RangoliDots />

            {/* ── Radio image with animated discs — mobile ── */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                marginTop: 8,
                opacity: mobileVisible ? 1 : 0,
                transform: mobileVisible ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s",
              }}
            >

              {/* Radio image */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <Image src="/radio.webp" alt="radio" width={800} height={600}
                  className="object-contain w-full" style={{ opacity: 0.82 }} />

                {/* Left disc */}
                <div className="speaker-spin absolute pointer-events-none"
                  style={{ width: "23%", aspectRatio: "1", bottom: "22.5%", left: "10%", opacity: 0.75, zIndex: 3 }}>
                  <Image src="/disc.webp" alt="left speaker" fill className="object-contain" />
                </div>

                {/* Right disc */}
                <div className="speaker-spin-reverse absolute pointer-events-none"
                  style={{ width: "23%", aspectRatio: "1", bottom: "22.5%", right: "10%", opacity: 0.75, zIndex: 3 }}>
                  <Image src="/disc.webp" alt="right speaker" fill className="object-contain" />
                </div>
              </div>
            </div>

            {/* ── Description card ── */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                marginTop: 16,
                opacity: mobileVisible ? 1 : 0,
                transform: mobileVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.75s ease 0.65s, transform 0.75s ease 0.65s",
              }}
            >
              {/* Animated gold border card */}
              <div style={{
                border: "1.5px solid #D4A017",
                borderRadius: 4,
                padding: "18px 20px",
                background: "linear-gradient(135deg, rgba(90,26,14,0.72) 0%, rgba(159,48,38,0.55) 100%)",
                backdropFilter: "blur(6px)",
                position: "relative",
                animation: "border-dance 4s ease-in-out infinite",
              }}>
                {/* Inner gold-line frame accent */}
                <div style={{
                  position: "absolute",
                  inset: 5,
                  border: "1px solid rgba(212,160,23,0.2)",
                  borderRadius: 2,
                  pointerEvents: "none",
                }} />


                <p
                  style={{
                    color: "#ffd21f",
                    fontStyle: "italic",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "clamp(0.85rem, 3.8vw, 1rem)",
                    lineHeight: 1.7,
                    textAlign: "center",
                    textShadow: "1px 1px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  Crescendo is VIT&apos;s inter-college fest that brings together students from
                  different institutions to celebrate talent, creativity, and competition.
                  Not just a fest — an experience filled with energy, innovation, performances,
                  and unforgettable campus moments.
                </p>

                {/* Bottom rangoli dots */}
                <RangoliDots />
              </div>

              {/* Corner ornaments on card */}
              <div style={{ position: "absolute", top: -8, left: -8 }}><CornerOrnament /></div>
              <div style={{ position: "absolute", top: -8, right: -8 }}><CornerOrnament flip /></div>
              <div style={{ position: "absolute", bottom: -8, left: -8, transform: "rotate(90deg)" }}><CornerOrnament /></div>
              <div style={{ position: "absolute", bottom: -8, right: -8, transform: "rotate(90deg) scaleX(-1)" }}><CornerOrnament /></div>
            </div>



          </div>
        </div>

      </section>
    </>
  );
}