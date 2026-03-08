"use client";

import { useEffect, useRef } from "react";

interface Props {
  analyser: AnalyserNode | null;
  playing: boolean;
}

const COLORS = [
  "#FF6B35", "#F72585", "#D4A017", "#3AAFA9", "#F7B32B", "#8B1538", "#FF6B35",
];

export default function DiscoLights({ analyser, playing }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      tRef.current += 0.008;
      const t = tRef.current;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Read bass energy if playing
      let energy = 0.12;
      if (playing && analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const avg = data.slice(0, 12).reduce((a, b) => a + b, 0) / 12;
        energy = 0.08 + (avg / 255) * 0.92;
      } else {
        energy = 0.1 + Math.abs(Math.sin(t * 0.8)) * 0.08;
      }

      // Smooth colour interpolation across palette
      const colorPos = (t * 0.3) % (COLORS.length - 1);
      const ci = Math.floor(colorPos);
      const cf = colorPos - ci;
      const hexToRgb = (h: string) => ({
        r: parseInt(h.slice(1, 3), 16),
        g: parseInt(h.slice(3, 5), 16),
        b: parseInt(h.slice(5, 7), 16),
      });
      const c1 = hexToRgb(COLORS[ci]);
      const c2 = hexToRgb(COLORS[ci + 1]);
      const r = Math.round(c1.r + (c2.r - c1.r) * cf);
      const g = Math.round(c1.g + (c2.g - c1.g) * cf);
      const b = Math.round(c1.b + (c2.b - c1.b) * cf);
      const color = `rgb(${r},${g},${b})`;

      // Swing angle: ±45° sweep across the whole hero
      const swing = Math.sin(t * 0.6) * 45;
      const angleRad = (swing * Math.PI) / 180;

      const originX = W / 2;
      const originY = 0;
      const beamLen = H * 1.1;

      const tipX = originX + Math.sin(angleRad) * beamLen;
      const tipY = originY + Math.cos(angleRad) * beamLen;

      // Beam width at tip — widens with energy
      const tipWidth = 60 + energy * 140;

      const perpX = -Math.cos(angleRad);
      const perpY = Math.sin(angleRad);

      // Outer soft glow (wide, very transparent)
      ctx.beginPath();
      ctx.moveTo(originX - 4, originY);
      ctx.lineTo(originX + 4, originY);
      ctx.lineTo(tipX + perpX * tipWidth * 2.5, tipY + perpY * tipWidth * 2.5);
      ctx.lineTo(tipX - perpX * tipWidth * 2.5, tipY - perpY * tipWidth * 2.5);
      ctx.closePath();
      const outerGrad = ctx.createLinearGradient(originX, originY, tipX, tipY);
      outerGrad.addColorStop(0, `rgba(${r},${g},${b},0.12)`);
      outerGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      // Main beam
      ctx.beginPath();
      ctx.moveTo(originX - 3, originY);
      ctx.lineTo(originX + 3, originY);
      ctx.lineTo(tipX + perpX * tipWidth, tipY + perpY * tipWidth);
      ctx.lineTo(tipX - perpX * tipWidth, tipY - perpY * tipWidth);
      ctx.closePath();
      const mainGrad = ctx.createLinearGradient(originX, originY, tipX, tipY);
      mainGrad.addColorStop(0, `rgba(${r},${g},${b},${(0.55 + energy * 0.3).toFixed(2)})`);
      mainGrad.addColorStop(0.5, `rgba(${r},${g},${b},${(0.2 + energy * 0.2).toFixed(2)})`);
      mainGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = mainGrad;
      ctx.fill();

      // Bright core line
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = `rgba(255,255,255,${(0.3 + energy * 0.4).toFixed(2)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glow dot at source
      const glowSize = 16 + energy * 20;
      const glowGrad = ctx.createRadialGradient(originX, 0, 0, originX, 0, glowSize);
      glowGrad.addColorStop(0, `rgba(255,255,255,0.95)`);
      glowGrad.addColorStop(0.3, `rgba(${r},${g},${b},0.8)`);
      glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(originX, 0, glowSize, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [analyser, playing]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 4,
      }}
    />
  );
}
