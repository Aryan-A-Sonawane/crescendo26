"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────
// Replace initials / names with real data. Photos optional — initials shown if no src.

const CORE: Member[] = [
  { name: "Aryan Mundra", role: "General Secretary", initial: "A", color: "#D4A017" },
  { name: "Anish Gawande", role: "President", initial: "A", color: "#FF6B35" },
  { name: "Sanket Palkar", role: "Joint Secretary", initial: "S", color: "#F72585" },
  { name: "Rajwardhan Rokade", role: "University Representative", initial: "R", color: "#3AAFA9" },
  { name: "Girish Bagul", role: "Treasurer", initial: "G", color: "#D4A017" },
  { name: "Pranav Patil", role: "Assistant University Representative", initial: "P", color: "#FF6B35" },
  { name: "Kaustubh Singh", role: "Sport Secretary", initial: "K", color: "#3AAFA9" },
];

const SABHAS: Sabha[] = [
  {
    id: "function-execution",
    name: "Function Execution Team",
    icon: "🎯",
    accent: "#1B4965",
    members: [
      { name: "Ayush Gupta", role: "Function Execution Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Shruti Raina", role: "Function Execution Secretary", initial: "S", color: "#3AAFA9" },
      { name: "Shripad Kanakdande", role: "Function Execution Secretary", initial: "S", color: "#3AAFA9" },
    ],
  },
  {
    id: "pr-branding",
    name: "PR and Branding Team",
    icon: "📢",
    accent: "#8B1538",
    members: [
      { name: "Ameya Badge", role: "Head PR and Branding", initial: "A", color: "#F72585" },
      { name: "Krishna Ardhapurkar", role: "Head PR and Branding", initial: "K", color: "#F72585" },
    ],
  },
  {
    id: "finance",
    name: "Finance Team",
    icon: "💰",
    accent: "#2D6A4F",
    members: [
      { name: "Tanvi Gudekar", role: "Finance Secretary", initial: "T", color: "#3AAFA9" },
      { name: "Tejas Runwal", role: "Finance Secretary", initial: "T", color: "#3AAFA9" },
    ],
  },
  {
    id: "aesthetics",
    name: "Aesthetics Team",
    icon: "🎨",
    accent: "#6B0F1A",
    members: [
      { name: "Arya Gaikwad", role: "Aesthetics Secretary", initial: "A", color: "#D4A017" },
      { name: "Sejal Band", role: "Aesthetics Secretary", initial: "S", color: "#D4A017" },
      { name: "Surabhi Bhalerao", role: "Aesthetics Secretary", initial: "S", color: "#D4A017" },
    ],
  },
  {
    id: "database",
    name: "Database Team",
    icon: "🗄️",
    accent: "#B85042",
    members: [
      { name: "Soham Tawari", role: "Database Secretary", initial: "S", color: "#FF6B35" },
      { name: "Amogh Nikumb", role: "Database Secretary", initial: "A", color: "#FF6B35" },
    ],
  },
  {
    id: "extra-curricular",
    name: "Extra Curricular Team",
    icon: "🎭",
    accent: "#8B1538",
    members: [
      { name: "Anush Nair", role: "Extra Curricular Secretary", initial: "A", color: "#F72585" },
      { name: "Palak Mahajan", role: "Extra Curricular Secretary", initial: "P", color: "#F72585" },
    ],
  },
  {
    id: "sponsorship",
    name: "Sponsorship Team",
    icon: "🤝",
    accent: "#2D6A4F",
    members: [
      { name: "Yash Chougale", role: "Sponsorship Secretary", initial: "Y", color: "#3AAFA9" },
    ],
  },
  {
    id: "light-sound",
    name: "Light & Sound Team",
    icon: "🔊",
    accent: "#1B4965",
    members: [
      { name: "Ayush Singh", role: "Light & Sound Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Padmanabh Khairnar", role: "Light & Sound Secretary", initial: "P", color: "#3AAFA9" },
    ],
  },
  {
    id: "publicity-outreach",
    name: "Publicity & Outreach Team",
    icon: "📣",
    accent: "#6B0F1A",
    members: [
      { name: "Nitya Munshi", role: "Publicity & Outreach Secretary", initial: "N", color: "#D4A017" },
      { name: "Sahil Datrange", role: "Publicity & Outreach Secretary", initial: "S", color: "#D4A017" },
      { name: "Yashowardhan Lengare", role: "Publicity & Outreach Secretary", initial: "Y", color: "#D4A017" },
    ],
  },
  {
    id: "resource-refreshment",
    name: "Resource & Refreshment Team",
    icon: "🍽️",
    accent: "#B85042",
    members: [
      { name: "Shruti Jaiswal", role: "Resource & Refreshment Secretary", initial: "S", color: "#FF6B35" },
      { name: "Atharva Joshi", role: "Resource & Refreshment Secretary", initial: "A", color: "#FF6B35" },
      { name: "Tanishq Chunamuri", role: "Resource & Refreshment Secretary", initial: "T", color: "#FF6B35" },
    ],
  },
  {
    id: "sports",
    name: "Sports Team",
    icon: "🏆",
    accent: "#2D6A4F",
    members: [
      { name: "Shravan Malwade", role: "Sports Secretary", initial: "S", color: "#3AAFA9" },
      { name: "Vedant Kambale", role: "Sports Secretary", initial: "V", color: "#3AAFA9" },
      { name: "Aditri Iyer", role: "Sports Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Shlok Raskar", role: "Sports Secretary", initial: "S", color: "#3AAFA9" },
    ],
  },
  {
    id: "technical",
    name: "Technical Team",
    icon: "⚙️",
    accent: "#1B4965",
    members: [
      { name: "Aditya Chougule", role: "Technical Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Arnav Phadke", role: "Technical Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Yug Jain", role: "Technical Secretary", initial: "Y", color: "#3AAFA9" },
    ],
  },
  {
    id: "venue",
    name: "Venue Team",
    icon: "📍",
    accent: "#8B1538",
    members: [
      { name: "Arnav Jadhav", role: "Venue Secretary", initial: "A", color: "#F72585" },
      { name: "Ansh Rathod", role: "Venue Secretary", initial: "A", color: "#F72585" },
      { name: "Mayur Sabale", role: "Venue Secretary", initial: "M", color: "#F72585" },
    ],
  },
  {
    id: "content-social",
    name: "Content and Social Media Team",
    icon: "📝",
    accent: "#6B0F1A",
    members: [
      { name: "Nishika Jain", role: "Content and Social Media Secretary", initial: "N", color: "#D4A017" },
      { name: "Amber Rathi", role: "Content and Social Media Secretary", initial: "A", color: "#D4A017" },
      { name: "Rudraksh Adhane", role: "Content and Social Media Secretary", initial: "R", color: "#D4A017" },
    ],
  },
  {
    id: "communications",
    name: "Communications Team",
    icon: "💬",
    accent: "#B85042",
    members: [
      { name: "Sanyukta Kakade", role: "Communications Secretary", initial: "S", color: "#FF6B35" },
      { name: "Soham Kadam", role: "Communications Secretary", initial: "S", color: "#FF6B35" },
    ],
  },
  {
    id: "editorial",
    name: "Editorial Team",
    icon: "📚",
    accent: "#8B1538",
    members: [
      { name: "Monali Bhujbal", role: "Editorial Secretary", initial: "M", color: "#F72585" },
    ],
  },
  {
    id: "multimedia",
    name: "Multimedia Team",
    icon: "🎬",
    accent: "#1B4965",
    members: [
      { name: "Pratham Hindocha", role: "Multimedia Secretary", initial: "P", color: "#3AAFA9" },
      { name: "Uday Deshmukh", role: "Multimedia Secretary", initial: "U", color: "#3AAFA9" },
      { name: "Vihaan Dhanapune", role: "Multimedia Secretary", initial: "V", color: "#3AAFA9" },
    ],
  },
  {
    id: "photography",
    name: "Photography Team",
    icon: "📸",
    accent: "#6B0F1A",
    members: [
      { name: "Atharva Nikam", role: "Photography Secretary", initial: "A", color: "#D4A017" },
      { name: "Mrugank Ghaisas", role: "Photography Secretary", initial: "M", color: "#D4A017" },
    ],
  },
  {
    id: "vaatchal",
    name: "Vaatchal Team",
    icon: "🛤️",
    accent: "#B85042",
    members: [
      { name: "Pranish Belsare", role: "Vaatchal Secretary", initial: "P", color: "#FF6B35" },
      { name: "Soham Suvarna", role: "Vaatchal Secretary", initial: "S", color: "#FF6B35" },
    ],
  },
  {
    id: "website",
    name: "Website Team",
    icon: "💻",
    accent: "#2D6A4F",
    members: [
      { name: "Anushka Bhalerao", role: "Website Secretary", initial: "A", color: "#3AAFA9" },
      { name: "Aryan Sonawane", role: "Website Secretary", initial: "A", color: "#3AAFA9" },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Member = { name: string; role: string; initial: string; color: string; photo?: string };
type Sabha = { id: string; name: string; icon: string; accent: string; members: Member[] };

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.04)`;
    };
    const onLeave = () => { el.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale(1)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

// ─── Components ───────────────────────────────────────────────────────────────

/** Decorative paisley-dot row used as section divider */
function PaisleyDivider({ accent }: { accent: string }) {
  const dots = [4, 6, 8, 12, 8, 6, 4];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: "0 auto 32px", width: "fit-content" }}>
      <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${accent})` }} />
      {dots.map((size, i) => (
        <span key={i} style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: accent, opacity: 0.7 + i * 0.04, boxShadow: `0 0 6px ${accent}88` }} />
      ))}
      <div style={{ width: 60, height: 1, background: `linear-gradient(to left, transparent, ${accent})` }} />
    </div>
  );
}

/** Core leadership card — large, tilt-enabled */
function CoreCard({ member, index }: { member: Member; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref);
  return (
    <div
      ref={ref}
      style={{
        transition: "transform 0.12s ease, box-shadow 0.2s ease",
        cursor: "default",
        borderRadius: 4,
        position: "relative",
      }}
    >
      {/* Outer decorative frame */}
      <div
        style={{
          background: "linear-gradient(145deg, #D4A017 0%, #8B1538 40%, #D4A017 100%)",
          padding: 3,
          borderRadius: 4,
          boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,160,23,0.2)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(160deg, #1a0505 0%, #2d0a10 60%, #1a0505 100%)",
            borderRadius: 2,
            padding: "28px 24px 22px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `radial-gradient(circle, ${member.color}18 1px, transparent 1px)`,
              backgroundSize: "18px 18px",
              pointerEvents: "none",
            }}
          />

          {/* Corner ornaments */}
          {["0,0","0,auto","auto,0","auto,auto"].map((pos, ci) => {
            const [top, bottom] = pos.split(",");
            return (
              <div key={ci} style={{ position: "absolute", top: top !== "auto" ? 8 : undefined, bottom: bottom !== "auto" ? 8 : undefined, left: ci < 2 ? 8 : undefined, right: ci >= 2 ? 8 : undefined, color: "#D4A017", fontSize: 11, opacity: 0.6, lineHeight: 1 }}>
                ✦
              </div>
            );
          })}

          {/* Avatar */}
          <div
            style={{
              width: 90, height: 90, borderRadius: "50%",
              background: `linear-gradient(135deg, ${member.color}44, ${member.color}88)`,
              border: `3px solid ${member.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 36, fontWeight: 700, color: member.color,
              fontFamily: "'Cinzel Decorative', serif",
              boxShadow: `0 0 20px ${member.color}55`,
              position: "relative", zIndex: 1,
            }}
          >
            {member.photo
              ? <Image src={member.photo} alt={member.name} width={90} height={90} style={{ borderRadius: "50%", objectFit: "cover", width: "100%", height: "100%" }} />
              : member.initial
            }
          </div>

          {/* Name */}
          <h3
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              color: "#D4A017",
              fontSize: "clamp(0.82rem, 1.6vw, 1rem)",
              letterSpacing: "0.04em",
              marginBottom: 6,
              position: "relative", zIndex: 1,
              textShadow: `0 0 20px ${member.color}66`,
            }}
          >
            {member.name}
          </h3>

          {/* Role badge */}
          <span
            style={{
              display: "inline-block",
              background: `linear-gradient(90deg, ${member.color}22, ${member.color}44)`,
              border: `1px solid ${member.color}66`,
              borderRadius: 99,
              padding: "3px 14px",
              fontSize: "0.7rem",
              color: member.color,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              position: "relative", zIndex: 1,
            }}
          >
            {member.role}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Regular member card with staggered reveal */
function MemberCard({ member, accent, delay }: { member: Member; accent: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useTilt(tiltRef);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      <div
        ref={tiltRef}
        style={{ transition: "transform 0.12s ease", cursor: "default" }}
      >
        {/* Shimmer-border card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${accent}cc, ${accent}99)`,
            padding: 2,
            borderRadius: 4,
          }}
        >
          <div
            style={{
              background: "linear-gradient(160deg, #200808 0%, #300d0d 100%)",
              borderRadius: 3,
              padding: "20px 16px 16px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle bg dots */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, ${accent}22 1px, transparent 1px)`, backgroundSize: "14px 14px", pointerEvents: "none" }} />

            {/* Avatar circle */}
            <div
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: `linear-gradient(135deg, ${accent}33, ${accent}66)`,
                border: `2px solid ${accent}aa`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: 21, fontWeight: 700, color: accent,
                fontFamily: "'Cinzel Decorative', serif",
                boxShadow: `0 0 12px ${accent}44`,
                position: "relative", zIndex: 1,
              }}
            >
              {member.photo
                ? <Image src={member.photo} alt={member.name} width={56} height={56} style={{ borderRadius: "50%", objectFit: "cover", width: "100%", height: "100%" }} />
                : member.initial
              }
            </div>

            <p
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#e8c87a",
                fontSize: "clamp(0.65rem, 1.2vw, 0.78rem)",
                letterSpacing: "0.02em",
                marginBottom: 5,
                position: "relative", zIndex: 1,
              }}
            >
              {member.name}
            </p>
            <span
              style={{
                fontSize: "0.62rem",
                color: `${accent}cc`,
                fontFamily: "'Poppins', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                position: "relative", zIndex: 1,
              }}
            >
              {member.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Sabha (department) section */
function SabhaSection({ s }: { s: Sabha }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeaderVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ marginBottom: 64 }}>
      {/* Section heading styled like a carved court notice */}
      <div
        ref={headerRef}
        style={{
          textAlign: "center",
          marginBottom: 28,
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: `linear-gradient(135deg, ${s.accent}44, ${s.accent}22)`,
            border: `1px solid ${s.accent}66`,
            borderRadius: 2,
            padding: "10px 28px",
            boxShadow: `0 4px 24px ${s.accent}33`,
          }}
        >
          <span style={{ fontSize: 20 }}>{s.icon}</span>
          <h3
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              color: "#D4A017",
              fontSize: "clamp(0.9rem, 2.5vw, 1.3rem)",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            {s.name}
          </h3>
          <span style={{ fontSize: 20 }}>{s.icon}</span>
        </div>
      </div>

      <PaisleyDivider accent={s.accent} />

      {/* Members grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 14,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {s.members.map((m, i) => (
          <MemberCard key={m.name} member={m} accent={s.accent} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const coreRef = useRef<HTMLDivElement>(null);
  const [coreVisible, setCoreVisible] = useState(false);

  useEffect(() => {
    const el = coreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCoreVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#110206", position: "relative", overflowX: "hidden" }}>

      {/* Left / Right border strips — matches main layout */}
      <div className="pointer-events-none hidden md:block" style={{ position: "fixed", left: -1, top: 0, bottom: 0, width: 120, zIndex: 9998, backgroundImage: "url(/border_1.png)", backgroundRepeat: "repeat-y", backgroundSize: "100% auto" }} />
      <div className="pointer-events-none hidden md:block" style={{ position: "fixed", right: -1, top: 0, bottom: 0, width: 120, zIndex: 9998, backgroundImage: "url(/border_1.png)", backgroundRepeat: "repeat-y", backgroundSize: "100% auto", transform: "scaleX(-1)" }} />

      <Navbar />

      {/* ── Hero ── */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          paddingTop: 140,
          paddingBottom: 0,
          overflow: "hidden",
        }}
      >
        {/* Spinning mandala backdrop */}
        <div className="pointer-events-none select-none" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 520, height: 520, opacity: 0.06, animation: "spin-slow 60s linear infinite" }}>
          <Image src="/mandala.webp" alt="" width={520} height={520} style={{ width: "100%", height: "auto" }} />
        </div>

        {/* Gold sunburst glow */}
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.4em",
            color: "#FF6B35",
            textTransform: "uppercase",
            marginBottom: 12,
            position: "relative",
          }}
        >
          Crescendo&apos;26
        </p>
        <h1
          className="font-nistha"
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            color: "#D4A017",
            lineHeight: 1,
            textShadow: "0 0 60px rgba(212,160,23,0.35)",
            position: "relative",
          }}
        >
          Our Rang Mandal
        </h1>
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: "#c9a87c",
            fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
            marginTop: 14,
            letterSpacing: "0.08em",
            position: "relative",
          }}
        >
          The dedicated sabhas behind the Indian Odyssey
        </p>

        {/* Warli frieze */}
        <div style={{ position: "relative", height: 90, overflow: "hidden", marginTop: 48 }}>
          <div style={{ display: "flex", width: "200vw", height: "100%", animation: "warli-scroll 28s linear infinite" }}>
            <div style={{ width: "100vw", height: "100%", backgroundImage: "url('/warli-painting.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.45, flexShrink: 0 }} />
            <div style={{ width: "100vw", height: "100%", backgroundImage: "url('/warli-painting.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.45, flexShrink: 0 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #110206 0%, transparent 40%, transparent 60%, #110206 100%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Gold rule */}
      <div style={{ height: 2, background: "linear-gradient(to right, transparent, #D4A017 25%, #FF6B35 50%, #D4A017 75%, transparent)" }} />

      {/* ── Main ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* ── Core Durbar ── */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.65rem", letterSpacing: "0.35em", color: "#FF6B35", textTransform: "uppercase" }}>The Inner Circle</p>
          <h2
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              color: "#D4A017",
              fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
              letterSpacing: "0.08em",
              margin: "6px 0 24px",
              textShadow: "0 0 30px rgba(212,160,23,0.3)",
            }}
          >
            Core Durbar
          </h2>
          <PaisleyDivider accent="#D4A017" />
        </div>

        <div
          ref={coreRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 20,
            maxWidth: 740,
            margin: "0 auto 80px",
          }}
        >
          {CORE.map((m, i) => (
            <div
              key={m.name}
              style={{
                opacity: coreVisible ? 1 : 0,
                transform: coreVisible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.7s ease ${i * 160}ms, transform 0.7s ease ${i * 160}ms`,
              }}
            >
              <CoreCard member={m} index={i} />
            </div>
          ))}
        </div>

        {/* ── Department Sabhas ── */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.65rem", letterSpacing: "0.35em", color: "#FF6B35", textTransform: "uppercase" }}>The Council</p>
          <h2
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              color: "#D4A017",
              fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
              letterSpacing: "0.08em",
              margin: "6px 0",
              textShadow: "0 0 30px rgba(212,160,23,0.3)",
            }}
          >
            The Sabhas
          </h2>
        </div>

        {SABHAS.map(s => <SabhaSection key={s.id} s={s} />)}

      </main>

      <Footer />
    </div>
  );
}
