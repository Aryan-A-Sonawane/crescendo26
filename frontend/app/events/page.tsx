"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const technical = [
  { name: "RC Rampage", fee: "₹60", prize: "—", desc: "High-speed RC car racing on a challenging track. Precision and speed are key!", img: "https://images.unsplash.com/photo-1563884072595-24f49fe5aa94?w=400&q=80" },
  { name: "Robo Soccer", fee: "₹500", prize: "₹8,000", desc: "Build a bot and battle it out on the soccer field. Goals, grit, and gears!", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80" },
  { name: "Software Hackathon", fee : "₹400", prize: "₹25,000", desc: "24-hour coding sprint. Build innovative solutions to real-world problems.", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80" },
  { name: "Code Relay", fee: "₹100", prize: "₹2,000", desc: "Team-based coding relay race. Each member adds their piece to the puzzle.", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80" },
  { name: "Gun Range Shooting", fee: "₹60", prize: "—", desc: "Test your aim and precision on the virtual gun range. Steady hands win!", img: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&q=80" },
  { name: "Buzzwire", fee: "₹40", prize: "—", desc: "Navigate the wire without touching it. Nerves of steel required!", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" },
  { name: "Line Following", fee: "₹500", prize: "₹7,500", desc: "Program your bot to follow a line at blazing speed. Accuracy is everything.", img: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=400&q=80" },
  { name: "LLM Workshop", fee: "₹100", prize: "—", desc: "Hands-on workshop on Large Language Models. Learn, build, and innovate.", img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80" },
  { name: "Agentic AI", fee: "Free", prize: "—", desc: "Explore autonomous AI agents and their real-world applications. The future is here.", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80" },
  { name: "Escape Room", fee: "₹120", prize: "—", desc: "Solve puzzles, crack codes, escape before time runs out. Think fast!", img: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=400&q=80" },
  { name: "Scavenger Hunt", fee: "₹70", prize: "₹3,000", desc: "Race across campus solving clues. Team work and wit lead the way.", img: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=400&q=80" },
];

const ec = [
  { name: "Nerf Mania", fee: "₹60", prize: "—", desc: "Epic Nerf battles in a custom arena. Dodge, aim, and dominate!", img: "https://images.unsplash.com/photo-1559181567-c3190bcd4f0c?w=400&q=80" },
  { name: "Splash Wars", fee: "₹90", prize: "—", desc: "Water balloon warfare! The wettest event of the fest!", img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80" },
  { name: "Mini Basketball", fee: "₹30", prize: "—", desc: "Pocket-sized hoops, full-sized fun. Shoot your shot!", img: "/events/sports/basketball.png" },
  { name: "Blind Rush", fee: "₹50", prize: "—", desc: "Navigate a blindfolded obstacle course guided only by your teammates.", img: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&q=80" },
  { name: "Human Ludo", fee: "₹80", prize: "—", desc: "You are the token! Play life-sized Ludo and outwit your rivals.", img: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&q=80" },
  { name: "Valorant", fee: "₹250", prize: "₹10,000", desc: "5v5 tactical shooter showdown. Prove you're the best agent on campus.", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80" },
  { name: "BGMI (Solo)", fee: "₹100", prize: "₹5,000", desc: "Battle Royale at its finest. Survive, loot, and be the last one standing.", img: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80" },
  { name: "BGMI (Squad)", fee: "₹240", prize: "₹6,500", desc: "Squad up and dominate the battleground. Communication wins wars.", img: "https://images.unsplash.com/photo-1587095951604-287a606ea78e?w=400&q=80" },
  { name: "FIFA", fee: "₹100", prize: "₹6,000", desc: "The beautiful game goes digital. Build your team and conquer the pitch.", img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80" },
  { name: "Clash Royale", fee: "₹80", prize: "₹6,000", desc: "Strategic card battles in real time. Outthink and outlast your opponent.", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80" },
  { name: "Free Fire", fee: "₹100", prize: "—", desc: "Intense BR action on mobile. Survive 50-player madness and claim victory.", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80" },
  { name: "IPL Auction", fee: "₹200", prize: "₹10,000", desc: "Be the team owner. Draft smartly, manage your budget, win the season.", img: "https://images.unsplash.com/photo-1540747913346-19212a4f3aac?w=400&q=80" },
  { name: "Fandom Trek", fee: "₹80", prize: "—", desc: "Quiz, cosplay, trivia — the ultimate fandom celebration on campus!", img: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400&q=80" },
  { name: "Stand-Up", fee: "₹100", prize: "₹5,000", desc: "Got jokes? Take the mic and make the crowd roar. Comedy open stage.", img: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=400&q=80" },
  { name: "Stock Market Workshop", fee: "₹100", prize: "—", desc: "Simulate real stock trades. Learn investing, risk, and strategy hands-on.", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80" },
  { name: "Dance Centric (Solo)", fee: "₹150", prize: "₹8,000", desc: "Electrify the stage solo — any form, any style, pure expression.", img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&q=80" },
  { name: "Dance Centric (Group)", fee: "₹1,000", prize: "₹15,000", desc: "Synchronised power, creative choreography, and group energy. Wow the crowd.", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&q=80" },
  { name: "VRock", fee: "₹800", prize: "₹15,000", desc: "Band showdown! Rock the stage with original or cover performances.", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" },
  { name: "Natyasamrat", fee: "₹1,000", prize: "₹10,000", desc: "Classical and contemporary drama competition. Let the curtain rise!", img: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&q=80" },
  { name: "Miss/Mr Crescendo", fee: "₹150", prize: "₹6,500", desc: "Personality, poise, and panache. Compete for the crown of Crescendo'26.", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80" },
];

const sports = [
  { name: "Basketball (Boys)", fee: "₹2,500", prize: "₹11,200", desc: "5-on-5 hardcourt battle. Shoot, dribble, and dunk your way to the championship.", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80" },
  { name: "Football (7-a-side)", fee: "₹3,000", prize: "₹25,000", desc: "Seven-a-side football on the campus ground. Beautiful game, fierce competition.", img: "https://images.unsplash.com/photo-1540747913346-19212a4f3aac?w=400&q=80" },
  { name: "Cricket", fee: "₹13,000", prize: "₹50,000", desc: "Full team cricket tournament. Bat, bowl, field — glory awaits the best XI.", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80" },
  { name: "Badminton (Boys)", fee: "₹1,500", prize: "₹13,000", desc: "Shuttlecock showdown on the court. Speed, agility, and smashes decide it.", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80" },
  { name: "Chess (Boys)", fee: "₹200", prize: "₹12,000", desc: "64 squares, infinite strategies. Outthink your opponent move by move.", img: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&q=80" },
  { name: "Badminton (Girls)", fee: "₹1,500", prize: "₹13,000", desc: "Lightning reflexes and court coverage. Who will claim the women's title?", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80" },
  { name: "Basketball (Girls)", fee: "₹2,200", prize: "₹11,000", desc: "Women's basketball — skill, teamwork, and heart on the hardwood.", img: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&q=80" },
  { name: "Football (Girls 7-a-side)", fee: "₹2,500", prize: "₹12,000", desc: "Women's seven-a-side football. Pace, precision, and passion on the pitch.", img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80" },
];

// ─── Flip Card ───────────────────────────────────────────────────────────────

type Event = { name: string; fee: string; prize: string; desc: string; img: string };

function FlipCard({ event }: { event: Event }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{ perspective: 1000, height: "clamp(320px, 45vw, 380px)", cursor: "pointer" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.img} alt={event.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(232,119,0,0.96) 0%, rgba(139,21,56,0.5) 50%, transparent 100%)",
            }}
          />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 18px" }}>
            <p style={{ color: "#FFF8E7", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(0.9rem,2.5vw,1.05rem)", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{event.name}</p>
            <p style={{ color: "#ffe9b0", fontFamily: "'Poppins',sans-serif", fontSize: "clamp(0.7rem,2vw,0.78rem)", margin: "4px 0 0" }}>
              Fee: {event.fee} &nbsp;|&nbsp; Prize: {event.prize}
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 16,
            overflow: "hidden",
            background: "linear-gradient(160deg, #FF6B35 0%, #e87700 45%, #8B1538 100%)",
            boxShadow: "0 8px 32px rgba(232,119,0,0.35)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px 18px",
            textAlign: "center",
          }}
        >
          {/* Decorative ring */}
          <div style={{ width: 50, height: 50, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>🎯</span>
          </div>
          <p style={{ color: "#FFF8E7", fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(0.95rem,2.8vw,1.08rem)", marginBottom: 10, textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>{event.name}</p>
          <p style={{ color: "#fff3e0", fontFamily: "'Poppins',sans-serif", fontSize: "clamp(0.75rem,2.2vw,0.84rem)", lineHeight: 1.6, marginBottom: 16, opacity: 0.95 }}>{event.desc}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.55)", borderRadius: 20, padding: "4px 13px", color: "#fff", fontSize: "clamp(0.68rem,2vw,0.75rem)", fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
              Fee: {event.fee}
            </span>
            {event.prize !== "—" && (
              <span style={{ background: "rgba(247,179,43,0.3)", border: "1px solid #F7B32B", borderRadius: 20, padding: "4px 13px", color: "#FFF8E7", fontSize: "clamp(0.68rem,2vw,0.75rem)", fontFamily: "'Poppins',sans-serif", fontWeight: 600 }}>
                🏆 {event.prize}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab data ────────────────────────────────────────────────────────────────

const tabs = [
  { key: "technical", label: "Technical", events: technical },
  { key: "ec", label: "Cultural & EC", events: ec },
  { key: "sports", label: "Sports", events: sports },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [active, setActive] = useState(0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3ba35", overflowX: "hidden" }}>
      <Navbar />

      {/* Hero banner */}
      <div
        style={{
          backgroundImage: "url('/events-hero.png')",
          backgroundSize: "auto",
          backgroundPosition: "top left",
          backgroundRepeat: "repeat",
          paddingTop: "clamp(90px, 16vw, 130px)",
          paddingBottom: "clamp(40px, 8vw, 70px)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >

        <div>
          <h1
            className="font-nistha"
            style={{ color: "#000000", fontSize: "clamp(2.4rem, 9vw, 5.5rem)", margin: 0, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
          >
            Events
          </h1>
          <div style={{ height: 3, width: 80, background: "linear-gradient(to right, #8B1538, #000, #8B1538)", margin: "14px auto 0", borderRadius: 2 }} />
          <p style={{ color: "#000000", fontFamily: "'Poppins',sans-serif", fontSize: "clamp(0.85rem,2.5vw,1.1rem)", marginTop: 14, marginBottom: 0 }}>
            6th – 9th April 2026 &nbsp;·&nbsp; VIT Campus
          </p>
        </div>
      </div>

      {/* Body section — event-body.jpg background */}
      <div
        style={{
          backgroundImage: "url('/events-body.png')",
          backgroundSize: "auto",
          backgroundPosition: "top left",
          backgroundRepeat: "repeat",
          backgroundAttachment: "local",
          position: "relative",
        }}
      >
        {/* Bright overlay so cards stay vibrant */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(243,186,53,0.55)", pointerEvents: "none", zIndex: 0 }} />

        {/* Tab pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "32px 16px 0", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => setActive(i)}
            style={{
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 700,
              fontSize: "clamp(0.8rem, 3vw, 0.95rem)",
              padding: "12px 24px",
              borderRadius: 999,
              border: `2px solid ${i === active ? "#8B1538" : "#e87700"}`,
              background: i === active
                ? "linear-gradient(135deg,#FF6B35 0%,#8B1538 100%)"
                : "#fff",
              color: i === active ? "#fff" : "#8B1538",
              cursor: "pointer",
              transition: "all 0.25s",
              boxShadow: i === active ? "0 6px 20px rgba(139,21,56,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
              minWidth: 110,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(24px, 5vw, 48px) clamp(12px, 4vw, 24px) 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
          gap: "clamp(14px, 3vw, 24px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {tabs[active].events.map(event => (
          <FlipCard key={event.name} event={event} />
        ))}
      </div>
      </div> {/* end body bg section */}

      <Footer />
    </div>
  );
}
