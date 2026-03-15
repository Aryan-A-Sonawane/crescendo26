"use client";

import { useState } from "react";
import Image from "next/image";

type FestEvent = {
  time: string;
  name: string;
  venue: string;
  image: string;
  info: string;
};

const ITEMS_PER_PAGE = 5;

const FEST_EVENTS: FestEvent[] = [
  {
    time: "09:00 AM",
    name: "CODE RELAY",
    venue: "Lab Block A-204",
    image: "/events/technical/CODE_RELAY.png",
    info: "A staged coding challenge where teams solve sequential tasks under strict time windows.",
  },
  {
    time: "10:00 AM",
    name: "BUZZWIRE",
    venue: "Innovation Arena",
    image: "/events/technical/BUZZWIRE.png",
    info: "Steady hand electronics challenge focused on precision and control under pressure.",
  },
  {
    time: "10:45 AM",
    name: "LINE FOLLOWING",
    venue: "Robotics Track",
    image: "/events/technical/LINE_FOLLOWING.png",
    info: "Autonomous bot challenge to complete a dynamic track in the least possible time.",
  },
  {
    time: "11:30 AM",
    name: "ESCAPE ROOM",
    venue: "Central Hall",
    image: "/events/technical/ESCAPE ROOM.png",
    info: "Puzzle-based team mission where logic, speed, and communication decide the winner.",
  },
  {
    time: "12:15 PM",
    name: "SOFTWARE HACKATHON",
    venue: "Main Tech Lab",
    image: "/events/technical/SOFTWARE_HACKATHON.png",
    info: "Build and pitch a working prototype to solve a real-world problem in limited time.",
  },
  {
    time: "01:30 PM",
    name: "ROBO SOCCER",
    venue: "Sports Dome",
    image: "/events/technical/ROBO_SOCCER.png",
    info: "Robot-versus-robot strategy game where precision movement and quick tactics matter.",
  },
  {
    time: "02:15 PM",
    name: "RC RAMPAGE",
    venue: "Outdoor Track",
    image: "/events/technical/RC_RAMPAGE.png",
    info: "Remote-control race with obstacle segments requiring speed, balance, and control.",
  },
  {
    time: "03:00 PM",
    name: "SCAVENGER HUNT",
    venue: "Campus Zone",
    image: "/events/technical/SCAVENGER HUNT.png",
    info: "Clue-based adventure across campus checkpoints with timed eliminations.",
  },
  {
    time: "03:45 PM",
    name: "BGMI (SQUAD)",
    venue: "E-Sports Arena",
    image: "/events/extracircular/BGMI(squad).png",
    info: "Team battle-royale format with bracket rounds and final leaderboard scoring.",
  },
  {
    time: "04:30 PM",
    name: "STANDUP COMEDY",
    venue: "Open Air Stage",
    image: "/events/extracircular/STANDUP_COMEDY.png",
    info: "Solo performance event judged on originality, timing, delivery, and audience impact.",
  },
];

export default function Events() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<FestEvent | null>(null);

  const totalPages = Math.ceil(FEST_EVENTS.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const visibleEvents = FEST_EVENTS.slice(start, start + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setPage((p) => Math.max(0, p - 1));
  };

  const handleNextPage = () => {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  };

  return (
    <section
      id="events"
      className="relative w-full overflow-hidden py-14 md:py-20"
      style={{
        background:
          "radial-gradient(circle at top, rgba(212,160,23,0.14) 0%, rgba(212,160,23,0) 26%), linear-gradient(180deg, #16110a 0%, #090704 48%, #120d07 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-350 px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-12 items-start">

          {/* Left Side */}
          <div>
            <h2
              className="leading-none text-left"
              style={{
                color: "#ffb51d",
                textShadow: "2px 2px 10px rgba(0,0,0,0.35)",
              }}
            >
              <span
                className="font-nistha"
                style={{
                  fontSize: "clamp(5rem, 10vw, 6rem)",
                  lineHeight: 0.9,
                  display: "inline-block",
                  verticalAlign: "baseline",
                }}
              >
                E
              </span>
              <span
                className="font-nistha"
                style={{
                  fontSize: "clamp(4rem, 3.2vw, 3.1rem)",
                  lineHeight: 1,
                  marginLeft: "0.12em",
                  letterSpacing: "0.05em",
                  verticalAlign: "baseline",
                }}
              >
                vents
              </span>
            </h2>

            <div
              className="mt-6 rounded-2xl"
              style={{
                border: "2px solid rgba(212,160,23,0.85)",
                background: "linear-gradient(180deg, rgba(18,14,10,0.98) 0%, rgba(8,7,5,0.96) 100%)",
                boxShadow: "0 14px 32px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(224,181,79,0.08)",
              }}
            >
              <div
                className="px-4 md:px-6 py-3 md:py-4"
                style={{ borderBottom: "1px solid rgba(212,160,23,0.45)" }}
              >
                <h3
                  className="text-left"
                  style={{
                    color: "#f2c765",
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 700,
                    fontSize: "clamp(1rem, 2.4vw, 1.45rem)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    textShadow: "0 0 8px rgba(242,199,101,0.24)",
                  }}
                >
                  FEST TIMELINE
                </h3>
              </div>

              <div className="px-3 md:px-5 py-3 md:py-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: "rgba(212,160,23,0.08)" }}>
                      <th className="text-left px-3 py-2" style={thStyle}>TIME</th>
                      <th className="text-left px-3 py-2" style={thStyle}>EVENT NAME</th>
                      <th className="text-left px-3 py-2" style={thStyle}>VENUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleEvents.map((event) => {
                      const isActive = selected?.name === event.name;
                      return (
                        <tr
                          key={`${event.time}-${event.name}`}
                          onClick={() => setSelected(event)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: isActive ? "rgba(212,160,23,0.12)" : "transparent",
                            borderBottom: "1px solid rgba(212,160,23,0.12)",
                          }}
                        >
                          <td className="px-3 py-3" style={tdStyle}>{event.time}</td>
                          <td className="px-3 py-3" style={{ ...tdStyle, fontWeight: 700 }}>{event.name}</td>
                          <td className="px-3 py-3" style={tdStyle}>{event.venue}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 0}
                    style={navBtnStyle(page === 0)}
                    aria-label="Previous 5 events"
                  >
                    ← Prev
                  </button>

                  <span style={{ color: "#d8b45d", fontFamily: "'Courier New', monospace", fontSize: 13, letterSpacing: "0.08em" }}>
                    Page {page + 1} / {totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages - 1}
                    style={navBtnStyle(page === totalPages - 1)}
                    aria-label="Next 5 events"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div
            className="w-full"
            style={{
              border: "2px solid rgba(212,160,23,0.85)",
              borderRadius: 16,
              background: "linear-gradient(180deg, rgba(20,15,10,0.97) 0%, rgba(10,8,5,0.96) 100%)",
              boxShadow: "0 14px 32px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(224,181,79,0.08)",
              padding: 14,
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(18,14,10,0.82)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "62%" }}>
                <Image
                  src={selected?.image ?? "/events-hero.png"}
                  alt={selected?.name ?? "Crescendo events"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="px-4 py-3" style={{ height: "38%", overflow: "auto" }}>
                <h4
                  style={{
                    color: "#f0c86a",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "clamp(1rem, 2vw, 1.35rem)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textShadow: "0 0 8px rgba(240,200,106,0.24)",
                    marginBottom: 8,
                  }}
                >
                  {selected?.name ?? "Click Any Event"}
                </h4>
                <p
                  style={{
                    color: "#ead8a7",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "clamp(0.86rem, 1.45vw, 0.98rem)",
                    lineHeight: 1.55,
                  }}
                >
                  {selected
                    ? `${selected.info} Time: ${selected.time}. Venue: ${selected.venue}.`
                    : "Select an event from the timeline table to preview poster and details here."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const thStyle: React.CSSProperties = {
  color: "#f2c765",
  fontFamily: "'Courier New', monospace",
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  textShadow: "0 0 6px rgba(242,199,101,0.18)",
};

const tdStyle: React.CSSProperties = {
  color: "#e8dcb4",
  fontFamily: "'Courier New', monospace",
  fontSize: 13,
  letterSpacing: "0.05em",
};

const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
  border: "1px solid rgba(212,160,23,0.8)",
  borderRadius: 999,
  background: disabled
    ? "linear-gradient(180deg, rgba(27,22,16,0.7) 0%, rgba(12,10,7,0.8) 100%)"
    : "linear-gradient(180deg, rgba(47,37,18,0.96) 0%, rgba(17,14,9,0.98) 100%)",
  color: disabled ? "rgba(212,160,23,0.35)" : "#f2c765",
  fontFamily: "'Courier New', monospace",
  fontWeight: 700,
  padding: "7px 14px",
  fontSize: 13,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  boxShadow: disabled ? "none" : "0 0 10px rgba(212,160,23,0.12)",
  cursor: disabled ? "not-allowed" : "pointer",
});
