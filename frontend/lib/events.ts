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
      "Hackathon",
      "Code Quest",
      "Project Cosmos",
      "Debugging Derby",
      "Circuit Wizards",
      "Tech Quiz",
      "AI/ML Challenge",
    ],
  },
  {
    category: "Cultural & Entertainment",
    emoji: "🎭",
    color: "#8B1538",
    events: [
      "Solo Dance",
      "Group Dance",
      "Solo Singing",
      "Group Singing / Band",
      "Nukkad Natak",
      "Fashion Show",
      "Beat Boxing",
      "Mono Act",
      "Mr. & Ms. Crescendo",
    ],
  },
  {
    category: "Sports",
    emoji: "🏆",
    color: "#2D6A4F",
    events: [
      "Cricket (T10)",
      "Football (5-a-side)",
      "Basketball (3×3)",
      "Badminton (Singles)",
      "Table Tennis (Singles)",
      "Volleyball",
      "Chess",
      "Carrom",
    ],
  },
];
