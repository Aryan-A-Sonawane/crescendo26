// ──────────────────────────────────────────────────────────────────────────────
//  Crescendo'26 — Events & Competitions List
//  Update this file when the official event list is available.
// ──────────────────────────────────────────────────────────────────────────────

export interface EventCategory {
  category: string;
  emoji: string;
  color: string; // accent color for the category card
  events: string[];
}

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    category: "Technical",
    emoji: "💻",
    color: "#1B4965",
    events: [
      "RC Rampage",
      "Robo Soccer",
      "Software Hackathon",
      "Code Relay",
      "Gun Range Shooting",
      "Buzzwire",
      "Line Following",
      "LLM Workshop",
      "Agentic AI",
      "Escape Room",
      "Scavenger Hunt",
    ],
  },
  {
    category: "EC and Cultural",
    emoji: "🎭",
    color: "#8B1538",
    events: [
      "Nerf Mania",
      "Splash Wars",
      "Mini Basketball",
      "Blind Rush",
      "Human Ludo",
      "Valorant",
      "BGMI (Solo)",
      "BGMI (Squad)",
      "FIFA",
      "Clash Royale",
      "Free Fire",
      "IPL Auction",
      "Fandom Trek",
      "Standup",
      "Stock Market Workshop",
      "Ideate Workshop",
      "Dance Centric(Solo)",
      "Dance Centric (Group)",
      "Vrock",
      "Natyasamrat",
      "Miss/Mr Crescendo",
    ],
  },
  {
    category: "Sports",
    emoji: "🏆",
    color: "#2D6A4F",
    events: [
      "Basketball (Boys)",
      "Football (7 aside)",
      "Cricket",
      "Badminton (Boys)",
      "Chess (Boys)",
      "Badminton (Girls)",
      "Basketball (Girls)",
    ],
  },
];
