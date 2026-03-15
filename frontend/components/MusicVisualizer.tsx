"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Drop your tracks here once you have the files ───────────────────────────
interface Track { src: string; }

const TRACKS: Track[] = [
  {
    src: "/music/Run Down The City Monica Dhurandhar 320 Kbps.mp3",
  },
  // { src: "/music/song2.mp3", title: "Song Two", artist: "Artist" },
  // { src: "/music/song3.mp3", title: "Song Three", artist: "Artist" },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function MusicVisualizer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIdx, setTrackIdx]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const track = TRACKS[trackIdx];

  // Load & auto-resume when track index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[trackIdx].src;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  // Auto-advance to next track on end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setTrackIdx(i => (i + 1) % TRACKS.length);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { audio.play().catch(() => {}); setIsPlaying(true); }
    else              { audio.pause();                 setIsPlaying(false); }
  }, []);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;          // restart current if >3 s in
    } else {
      setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length);
    }
  }, []);

  const next = useCallback(() => {
    setTrackIdx(i => (i + 1) % TRACKS.length);
  }, []);

  return (
    <>
      <audio ref={audioRef} src={track.src} preload="auto" style={{ display: "none" }} />

      {/* ── Centered controls below crescendo logo ── */}
      <div
        className="pointer-events-auto select-none"
        style={{
          position: "absolute",
          top: "75%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* ⏮  ▶/⏸  ⏭ */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* Prev */}
          <Btn onClick={prev} title="Previous" size={45}>
            <PrevIcon />
          </Btn>

          {/* Play / Pause — slightly bigger */}
          <Btn onClick={togglePlay} title={isPlaying ? "Pause" : "Play"} size={60}>
            {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </Btn>

          {/* Next */}
          <Btn onClick={next} title="Next" size={45}>
            <NextIcon />
          </Btn>
        </div>
      </div>
    </>
  );
}

/* ── Reusable button ── */
function Btn({
  onClick, title, size, dim = false, children,
}: {
  onClick: () => void;
  title: string;
  size: number;
  dim?: boolean;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: hovered ? "#6B0F1A" : (dim ? "rgba(139,21,56,0.6)" : "#8B1538"),
        border: `2px solid ${hovered ? "#F7B32B" : "#D4A017"}`,
        color: "#F7B32B",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transform: hovered ? "scale(1.12)" : "scale(1)",
        transition: "transform 0.15s, background-color 0.15s, border-color 0.15s",
        boxShadow: hovered
          ? "0 4px 16px rgba(0,0,0,0.45)"
          : "0 2px 8px rgba(0,0,0,0.3)",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ── Icons ── */
function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}
