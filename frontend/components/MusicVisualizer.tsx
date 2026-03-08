"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SONG_SRC = "/music/Run Down The City Monica Dhurandhar 320 Kbps.mp3";

export default function MusicVisualizer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current!;
    audio.muted = true;
    audio.play().catch(() => {});
  }, []);

  const handleMute = useCallback(() => {
    const audio = audioRef.current!;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }, []);

  return (
    <div
      className="pointer-events-auto"
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
        zIndex: 10000,
      }}
    >
      <audio ref={audioRef} src={SONG_SRC} loop muted preload="auto" style={{ display: "none" }} />

      {muted && (
        <span
          style={{
            fontSize: 12,
            color: "#8B1538",
            backgroundColor: "#F7B32B",
            padding: "3px 8px",
            borderRadius: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
          onClick={handleMute}
        >
          🔇 Tap to unmute
        </span>
      )}

      <button
        onClick={handleMute}
        title={muted ? "Unmute" : "Mute"}
        style={{
          width: 38, height: 38, borderRadius: "50%",
          backgroundColor: "#8B1538", border: "2px solid #D4A017",
          color: "#F7B32B", fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)", transition: "transform 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}