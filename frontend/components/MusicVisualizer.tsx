"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Track { src: string; }

interface MusicVisualizerProps {
  onPlaybackChange?: (isPlaying: boolean) => void;
}

const TRACKS: Track[] = [
  {
    src: "/music/Run Down The City Monica Dhurandhar 320 Kbps.mp3",
  },
];

export default function MusicVisualizer({ onPlaybackChange }: MusicVisualizerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const track = TRACKS[trackIdx];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[trackIdx].src;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
  }, [trackIdx, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setTrackIdx((i) => (i + 1) % TRACKS.length);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        const wasMuted = audio.muted;
        audio.muted = true;
        audio.play().then(() => {
          audio.muted = wasMuted;
          setIsPlaying(true);
        }).catch(() => {
          audio.muted = wasMuted;
        });
      });
    };

    tryPlay();

    const resumeOnGesture = () => tryPlay();
    window.addEventListener("pointerdown", resumeOnGesture, { once: true });
    window.addEventListener("keydown", resumeOnGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", resumeOnGesture);
      window.removeEventListener("keydown", resumeOnGesture);
    };
  }, []);

  useEffect(() => {
    onPlaybackChange?.(isPlaying);
  }, [isPlaying, onPlaybackChange]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    }
  }, []);

  const next = useCallback(() => {
    setTrackIdx((i) => (i + 1) % TRACKS.length);
  }, []);

  return (
    <>
      <audio ref={audioRef} src={track.src} preload="auto" autoPlay playsInline style={{ display: "none" }} />

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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Btn onClick={prev} title="Previous" size={45}>
            <PrevIcon />
          </Btn>

          <Btn onClick={togglePlay} title={isPlaying ? "Pause" : "Play"} size={60}>
            {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </Btn>

          <Btn onClick={next} title="Next" size={45}>
            <NextIcon />
          </Btn>
        </div>
      </div>
    </>
  );
}

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
