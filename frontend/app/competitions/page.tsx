"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const technical = [
  { name: "RC Rampage", fee: "₹60", prize: "—", desc: "High-speed RC car racing on a challenging track. Precision and speed are key!", img: "/events/technical/RC_RAMPAGE.png" },
  { name: "Robo Soccer", fee: "₹500", prize: "₹8,000", desc: "Build a bot and battle it out on the soccer field. Goals, grit, and gears!", img: "/events/technical/ROBO_SOCCER.png" },
  { name: "Software Hackathon", fee: "₹400", prize: "₹25,000", desc: "24-hour coding sprint. Build innovative solutions to real-world problems.", img: "/events/technical/SOFTWARE_HACKATHON.png" },
  { name: "Code Relay", fee: "₹100", prize: "₹2,000", desc: "Team-based coding relay race. Each member adds their piece to the puzzle.", img: "/events/technical/CODE_RELAY.png" },
  { name: "Gun Range Shooting", fee: "₹60", prize: "—", desc: "Test your aim and precision on the virtual gun range. Steady hands win!", img: "/events/technical/GUN RANGE SHOOTING.png" },
  { name: "Buzzwire", fee: "₹40", prize: "—", desc: "Navigate the wire without touching it. Nerves of steel required!", img: "/events/technical/BUZZWIRE.png" },
  { name: "Line Following", fee: "₹500", prize: "₹7,500", desc: "Program your bot to follow a line at blazing speed. Accuracy is everything.", img: "/events/technical/LINE_FOLLOWING.png" },
  { name: "LLM Workshop", fee: "₹100", prize: "—", desc: "Hands-on workshop on Large Language Models. Learn, build, and innovate.", img: "/events/technical/LLM WORKSHOP.png" },
  { name: "Agentic AI", fee: "Free", prize: "—", desc: "Explore autonomous AI agents and their real-world applications. The future is here.", img: "/events/technical/LLM WORKSHOP.png" },
  { name: "Escape Room", fee: "₹120", prize: "—", desc: "Solve puzzles, crack codes, escape before time runs out. Think fast!", img: "/events/technical/ESCAPE ROOM.png" },
  { name: "Scavenger Hunt", fee: "₹70", prize: "₹3,000", desc: "Race across campus solving clues. Team work and wit lead the way.", img: "/events/technical/SCAVENGER HUNT.png" },
];

const ec = [
  { name: "Nerf Mania", fee: "₹60", prize: "—", desc: "Epic Nerf battles in a custom arena. Dodge, aim, and dominate!", img: "/events/extracircular/NERF_MANIA.png" },
  { name: "Splash Wars", fee: "₹90", prize: "—", desc: "Water balloon warfare! The wettest event of the fest!", img: "/events/extracircular/SPLASH_WARS.png" },
  { name: "Mini Basketball", fee: "₹30", prize: "—", desc: "Pocket-sized hoops, full-sized fun. Shoot your shot!", img: "/events/extracircular/MINI_BASKETBALL.png" },
  { name: "Blind Rush", fee: "₹50", prize: "—", desc: "Navigate a blindfolded obstacle course guided only by your teammates.", img: "/events/extracircular/BLIND_RUSH.png" },
  { name: "Human Ludo", fee: "₹80", prize: "—", desc: "You are the token! Play life-sized Ludo and outwit your rivals.", img: "/events/extracircular/HUMAN_LUDO.png" },
  { name: "Valorant", fee: "₹250", prize: "₹10,000", desc: "5v5 tactical shooter showdown. Prove you're the best agent on campus.", img: "/events/extracircular/VALORANT.png" },
  { name: "BGMI (Solo)", fee: "₹100", prize: "₹5,000", desc: "Battle Royale at its finest. Survive, loot, and be the last one standing.", img: "/events/extracircular/BGMI(solo).png" },
  { name: "BGMI (Squad)", fee: "₹240", prize: "₹6,500", desc: "Squad up and dominate the battleground. Communication wins wars.", img: "/events/extracircular/BGMI(squad).png" },
  { name: "FIFA", fee: "₹100", prize: "₹6,000", desc: "The beautiful game goes digital. Build your team and conquer the pitch.", img: "/events/extracircular/FIFA.png" },
  { name: "Clash Royale", fee: "₹80", prize: "₹6,000", desc: "Strategic card battles in real time. Outthink and outlast your opponent.", img: "/events/extracircular/CLASH_ROYALE.png" },
  { name: "Free Fire", fee: "₹100", prize: "—", desc: "Intense BR action on mobile. Survive 50-player madness and claim victory.", img: "/events/extracircular/FREE_FIRE.png" },
  { name: "IPL Auction", fee: "₹200", prize: "₹10,000", desc: "Be the team owner. Draft smartly, manage your budget, win the season.", img: "/events/extracircular/IPL_AUCTION.png" },
  { name: "Fandom Trek", fee: "₹80", prize: "—", desc: "Quiz, cosplay, trivia — the ultimate fandom celebration on campus!", img: "/events/extracircular/FANDOM_TREK.png" },
  { name: "Stand-Up", fee: "₹100", prize: "₹5,000", desc: "Got jokes? Take the mic and make the crowd roar. Comedy open stage.", img: "/events/extracircular/STANDUP_COMEDY.png" },
  { name: "Stock Market Workshop", fee: "₹100", prize: "—", desc: "Simulate real stock trades. Learn investing, risk, and strategy hands-on.", img: "/events/extracircular/STOCK MARKET_WORKSHOP.png" },
  { name: "Dance Centric (Solo)", fee: "₹150", prize: "₹8,000", desc: "Electrify the stage solo — any form, any style, pure expression.", img: "/events/extracircular/DANCE-CENTRIC(SOLO).png" },
  { name: "Dance Centric (Group)", fee: "₹1,000", prize: "₹15,000", desc: "Synchronised power, creative choreography, and group energy. Wow the crowd.", img: "/events/extracircular/DANCE-GROUP.png" },
  { name: "VRock", fee: "₹800", prize: "₹15,000", desc: "Band showdown! Rock the stage with original or cover performances.", img: "/events/extracircular/VROCK.png" },
  { name: "Natyasamrat", fee: "₹1,000", prize: "₹10,000", desc: "Classical and contemporary drama competition. Let the curtain rise!", img: "/events/extracircular/NATYASAMRAT.png" },
  { name: "Miss/Mr Crescendo", fee: "₹150", prize: "₹6,500", desc: "Personality, poise, and panache. Compete for the crown of Crescendo'26.", img: "/events/extracircular/MRMISS%20CRESCENDO.png" },
];

const sports = [
  { name: "Basketball (Boys)", fee: "₹2,500", prize: "₹11,200", desc: "5-on-5 hardcourt battle. Shoot, dribble, and dunk your way to the championship.", img: "/events/sports/BASKETBALL(BOYS).png" },
  { name: "Football (7-a-side)", fee: "₹3,000", prize: "₹25,000", desc: "Seven-a-side football on the campus ground. Beautiful game, fierce competition.", img: "/events/sports/FOOTBALL(BOYS).png" },
  { name: "Cricket", fee: "₹13,000", prize: "₹50,000", desc: "Full team cricket tournament. Bat, bowl, field — glory awaits the best XI.", img: "/events/sports/CRICKET.png" },
  { name: "Badminton (Boys)", fee: "₹1,500", prize: "₹13,000", desc: "Shuttlecock showdown on the court. Speed, agility, and smashes decide it.", img: "/events/sports/BADMINTON(BOYS).png" },
  { name: "Chess (Boys)", fee: "₹200", prize: "₹12,000", desc: "64 squares, infinite strategies. Outthink your opponent move by move.", img: "/events/sports/CHESS.png" },
  { name: "Badminton (Girls)", fee: "₹1,500", prize: "₹13,000", desc: "Lightning reflexes and court coverage. Who will claim the women's title?", img: "/events/sports/BADMINTON(GIRLS).png" },
  { name: "Basketball (Girls)", fee: "₹2,200", prize: "₹11,000", desc: "Women's basketball — skill, teamwork, and heart on the hardwood.", img: "/events/sports/BASKETBALL(GIRLS).png" },
  { name: "Football (Girls 7-a-side)", fee: "₹2,500", prize: "₹12,000", desc: "Women's seven-a-side football. Pace, precision, and passion on the pitch.", img: "/events/sports/FOOTBALL(GIRLS).png" },
];

// ─── Rulebook PDF paths ───────────────────────────────────────────────────────
const rulebooks: Record<string, { label: string; path: string }[]> = {
  technical: [{ label: "Technical Rulebook", path: "/rulebooks/Technical.pdf" }],
  ec:        [{ label: "EC Rulebook",         path: "/rulebooks/Extra-Curriular.pdf" }],
  sports:    [{ label: "Sports Rulebook",     path: "/rulebooks/Sports.pdf" }],
};

// ─── Tab config ───────────────────────────────────────────────────────────────
const tabs = [
  { key: "technical", label: "Technical",    events: technical },
  { key: "ec",        label: "Cultural & EC", events: ec },
  { key: "sports",    label: "Sports",        events: sports },
];

// ─── GooeyNav ────────────────────────────────────────────────────────────────
// Faithfully recreates the reactbits.dev GooeyNav using the SVG gooey filter
// technique: feGaussianBlur + feColorMatrix on the blobs layer, then
// feComposite to cut the crisp labels back on top.

interface GooeyNavProps {
  items: { label: string }[];
  active: number;
  onChange: (i: number) => void;
  // Colours
  activeColor?: string;   // pill fill  (default: crimson→orange gradient)
  textColor?:   string;   // active label colour
  inactiveText?: string;  // inactive label colour
}

function GooeyNav({
  items,
  active,
  onChange,
  activeColor   = "linear-gradient(135deg,#FF6B35 0%,#8B1538 100%)",
  textColor     = "#fff",
  inactiveText  = "#8B1538",
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillGeometry, setPillGeometry] = useState<{ left: number; width: number } | null>(null);
  const [prevPill,     setPrevPill]     = useState<{ left: number; width: number } | null>(null);
  const [isAnimating,  setIsAnimating]  = useState(false);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const filterId = useRef(`gooey-${Math.random().toString(36).slice(2)}`);

  // Measure the active pill position relative to the container
  const measurePill = (idx: number) => {
    const container = containerRef.current;
    const btn       = btnRefs.current[idx];
    if (!container || !btn) return null;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    return { left: bRect.left - cRect.left, width: bRect.width };
  };

  // Initial measurement
  useEffect(() => {
    const geom = measurePill(active);
    if (geom) setPillGeometry(geom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-measure on resize
  useEffect(() => {
    const handleResize = () => {
      const geom = measurePill(active);
      if (geom) setPillGeometry(geom);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleClick = (idx: number) => {
    if (idx === active || isAnimating) return;
    const prev = measurePill(active);
    const next = measurePill(idx);
    if (!prev || !next) return;

    setPrevPill(prev);
    setPillGeometry(prev);           // keep old pill visible during stretch
    setIsAnimating(true);
    onChange(idx);

    // Two-phase animation:
    // Phase 1 (stretch): blob stretches to cover both pills simultaneously
    // Phase 2 (snap):    blob contracts to new pill position
    const isMovingRight = next.left > prev.left;

    // Phase 1: stretch
    const stretched = {
      left:  Math.min(prev.left, next.left),
      width: Math.abs(next.left + next.width - prev.left),
    };
    requestAnimationFrame(() => {
      setPillGeometry(stretched);
    });

    setTimeout(() => {
      // Phase 2: snap to new pill
      setPillGeometry(next);
      setTimeout(() => {
        setPrevPill(null);
        setIsAnimating(false);
      }, 300);
    }, isMovingRight ? 160 : 120);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* Hidden SVG filter — renders off-screen */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id={filterId.current} x="-20%" y="-50%" width="140%" height="200%">
            {/* Blur the blob shapes together */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            {/* Sharpen alpha so blobs snap together with gooey merge */}
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0 0 0 22 -9"
              result="goo"
            />
            {/* Composite source labels back on top of the gooey shape */}
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Nav container — apply gooey filter to the whole thing */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 0,
          background: "#fff",
          borderRadius: 999,
          padding: "6px",
          boxShadow: "0 4px 24px rgba(139,21,56,0.14), 0 1px 4px rgba(0,0,0,0.08)",
          // Apply gooey filter to the blobs layer only (see below)
        }}
      >
        {/* ── Blobs layer (gooey filter applied here) ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: 999,
            overflow: "hidden",
            filter: `url(#${filterId.current})`,
            pointerEvents: "none",
          }}
        >
          {/* Active pill blob */}
          {pillGeometry && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: pillGeometry.left - 6,   // -6 to account for container padding
                width: pillGeometry.width,
                background: activeColor,
                borderRadius: 999,
                transition: isAnimating
                  ? "left 0.28s cubic-bezier(0.34,1.2,0.64,1), width 0.28s cubic-bezier(0.34,1.2,0.64,1)"
                  : "none",
              }}
            />
          )}
        </div>

        {/* ── Tab buttons (labels sit above the gooey layer) ── */}
        {items.map((item, i) => (
          <button
            key={item.label}
            ref={el => { btnRefs.current[i] = el; }}
            onClick={() => handleClick(i)}
            style={{
              position: "relative",
              zIndex: 1,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(0.8rem, 3vw, 0.95rem)",
              padding: "12px clamp(16px, 3vw, 28px)",
              borderRadius: 999,
              border: "none",
              background: "transparent",
              color: i === active ? textColor : inactiveText,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 0.25s ease",
              outline: "none",
              minWidth: 110,
              userSelect: "none",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PDF Modal ───────────────────────────────────────────────────────────────
function PdfModal({ pdfPath, label, onClose }: { pdfPath: string; label: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0;transform:translateY(32px) scale(0.97) } to { opacity:1;transform:translateY(0) scale(1) } }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(160deg,#1a0a00 0%,#2d1200 100%)",
          border: "1px solid rgba(232,119,0,0.4)",
          borderRadius: 20,
          width: "min(860px,100%)",
          height: "min(90vh,720px)",
          display: "flex", flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,119,0,0.15)",
          animation: "slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)",
          overflow: "hidden",
        }}
      >
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",background:"linear-gradient(90deg,#e87700 0%,#8B1538 100%)",flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:20 }}>📋</span>
            <span style={{ color:"#fff",fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:"clamp(0.85rem,2.5vw,1rem)" }}>{label}</span>
          </div>
          <div style={{ display:"flex",gap:10,alignItems:"center" }}>
            <a href={pdfPath} download style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.5)",borderRadius:8,padding:"6px 14px",color:"#fff",fontFamily:"'Poppins',sans-serif",fontSize:"0.78rem",fontWeight:600,textDecoration:"none",cursor:"pointer" }}>⬇ Download</a>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:18 }} aria-label="Close rulebook">✕</button>
          </div>
        </div>
        <iframe src={`${pdfPath}#toolbar=1&navpanes=0&scrollbar=1`} title={label} style={{ flex:1,border:"none",width:"100%",background:"#1a0a00" }} />
      </div>
    </div>
  );
}

// ─── Rulebook Strip ───────────────────────────────────────────────────────────
function RulebookStrip({ tabKey }: { tabKey: string }) {
  const [openPdf, setOpenPdf] = useState<{ path: string; label: string } | null>(null);
  const books = rulebooks[tabKey] ?? [];
  return (
    <>
      <div style={{ display:"flex",justifyContent:"center",flexWrap:"wrap",gap:10,padding:"18px 16px 0",position:"relative",zIndex:1 }}>
        {books.map(book => (
          <button
            key={book.path}
            onClick={() => setOpenPdf({ path: book.path, label: book.label })}
            style={{ display:"flex",alignItems:"center",gap:7,fontFamily:"'Poppins',sans-serif",fontWeight:600,fontSize:"clamp(0.74rem,2.2vw,0.84rem)",padding:"9px 18px",borderRadius:999,border:"2px solid #8B1538",background:"rgba(139,21,56,0.08)",color:"#8B1538",cursor:"pointer",transition:"all 0.22s",boxShadow:"0 2px 10px rgba(139,21,56,0.08)" }}
            onMouseEnter={e => { e.currentTarget.style.background="linear-gradient(135deg,#FF6B35,#8B1538)";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="#FF6B35"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(139,21,56,0.08)";e.currentTarget.style.color="#8B1538";e.currentTarget.style.borderColor="#8B1538"; }}
          >📋 {book.label}</button>
        ))}
      </div>
      {openPdf && <PdfModal pdfPath={openPdf.path} label={openPdf.label} onClose={() => setOpenPdf(null)} />}
    </>
  );
}

// ─── Flip Card ───────────────────────────────────────────────────────────────
type Event = { name: string; fee: string; prize: string; desc: string; img: string };

function FlipCard({ event }: { event: Event }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective:1000,height:"clamp(320px,45vw,380px)",cursor:"pointer" }} onMouseEnter={()=>setFlipped(true)} onMouseLeave={()=>setFlipped(false)} onClick={()=>setFlipped(f=>!f)}>
      <div style={{ position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",transition:"transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0deg)" }}>
        {/* Front */}
        <div style={{ position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,0.35)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.img} alt={event.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(232,119,0,0.96) 0%,rgba(139,21,56,0.5) 50%,transparent 100%)" }} />
          <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"18px 18px" }}>
            <p style={{ color:"#FFF8E7",fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:"clamp(0.9rem,2.5vw,1.05rem)",margin:0,textShadow:"0 1px 4px rgba(0,0,0,0.4)" }}>{event.name}</p>
            <p style={{ color:"#ffe9b0",fontFamily:"'Poppins',sans-serif",fontSize:"clamp(0.7rem,2vw,0.78rem)",margin:"4px 0 0" }}>Fee: {event.fee} &nbsp;|&nbsp; Prize: {event.prize}</p>
          </div>
        </div>
        {/* Back */}
        <div style={{ position:"absolute",inset:0,backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)",overflow:"hidden",background:"linear-gradient(160deg,#FF6B35 0%,#e87700 45%,#8B1538 100%)",boxShadow:"0 8px 32px rgba(232,119,0,0.35)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"24px 18px",textAlign:"center" }}>
          <div style={{ width:50,height:50,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14 }}><span style={{ fontSize:22 }}>🎯</span></div>
          <p style={{ color:"#FFF8E7",fontFamily:"'Poppins',sans-serif",fontWeight:700,fontSize:"clamp(0.95rem,2.8vw,1.08rem)",marginBottom:10,textShadow:"0 1px 4px rgba(0,0,0,0.2)" }}>{event.name}</p>
          <p style={{ color:"#fff3e0",fontFamily:"'Poppins',sans-serif",fontSize:"clamp(0.75rem,2.2vw,0.84rem)",lineHeight:1.6,marginBottom:16,opacity:0.95 }}>{event.desc}</p>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center" }}>
            <span style={{ background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.55)",borderRadius:20,padding:"4px 13px",color:"#fff",fontSize:"clamp(0.68rem,2vw,0.75rem)",fontFamily:"'Poppins',sans-serif",fontWeight:600 }}>Fee: {event.fee}</span>
            {event.prize !== "—" && <span style={{ background:"rgba(247,179,43,0.3)",border:"1px solid #F7B32B",borderRadius:20,padding:"4px 13px",color:"#FFF8E7",fontSize:"clamp(0.68rem,2vw,0.75rem)",fontFamily:"'Poppins',sans-serif",fontWeight:600 }}>🏆 {event.prize}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [active, setActive] = useState(0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3ba35", overflowX: "hidden" }}>
      <Navbar />

      {/* Hero banner */}
      <div style={{ backgroundColor:"#f3ba35",paddingTop:"clamp(90px,16vw,130px)",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div>
          <h1 className="font-nistha" style={{ fontSize:"clamp(2.4rem,9vw,5.5rem)",marginTop:40,textShadow:"0 2px 12px rgba(0,0,0,0.3)" }}>
            Events
          </h1>
        </div>
      </div>

      {/* Body */}
      <div style={{ backgroundColor:"#f3ba35",position:"relative" }}>

        {/* ── GooeyNav Tab Switcher ── */}
        <div style={{ padding: "0px 16px 0", position: "relative", zIndex: 1 }}>
          <GooeyNav
            items={tabs.map(t => ({ label: t.label }))}
            active={active}
            onChange={setActive}
          />
        </div>

        {/* Rulebook buttons */}
        <RulebookStrip tabKey={tabs[active].key} />

        {/* Cards grid */}
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"clamp(24px,5vw,48px) clamp(12px,4vw,24px) 80px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,260px),1fr))",gap:"clamp(14px,3vw,24px)",position:"relative",zIndex:1 }}>
          {tabs[active].events.map(event => (
            <FlipCard key={event.name} event={event} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}