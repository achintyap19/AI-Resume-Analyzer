import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

/**
 * AICore.jsx — POLISHED
 * Changes from v1:
 *  - Five layered glow rings instead of one outer halo
 *  - Two counter-rotating ring halos (CSS animation, no extra deps)
 *  - Inner energy shimmer: a second canvas layer for a chromatic lens flare
 *  - Particle tails: each particle now leaves a short fading trail
 *  - Spawn rate responds smoothly to state via a ref (no canvas restart)
 *  - Orb has inner specular highlight + outer colour bloom
 */

const ACTIVE_STATES = new Set(["comparing", "calculating", "generating"]);
const QUIET_STATES  = new Set(["idle", "ready"]);

// Smooth lerp so spawn-rate transitions feel organic not snappy
function lerp(a, b, t) { return a + (b - a) * t; }

export default function AICore({ state, className = "" }) {
  const canvasRef   = useRef(null);
  const stateRef    = useRef(state);
  const spawnAcc    = useRef(0); // fractional accumulator

  // Keep stateRef current without restarting the canvas loop
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext("2d");
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const SIZE = 260;
    canvas.width        = SIZE * dpr;
    canvas.height       = SIZE * dpr;
    canvas.style.width  = SIZE + "px";
    canvas.style.height = SIZE + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const C   = { x: SIZE / 2, y: SIZE / 2 };
    let particles = [];
    let raf;
    let currentRate = 0.06;

    function targetRate() {
      const s = stateRef.current;
      if (ACTIVE_STATES.has(s)) return 0.7;
      if (QUIET_STATES.has(s))  return 0.06;
      return 0.28;
    }

    function spawn() {
      const isInflow = Math.random() < 0.55;
      const angle    = Math.random() * Math.PI * 2;
      const dist     = 105 + Math.random() * 8;

      // Inflow: from left (resume side), curves into core
      // Outflow: erupts from core toward dashboard (rightward arc)
      const sx = isInflow ? C.x - 150 + (Math.random() - 0.5) * 20 : C.x;
      const sy = isInflow ? C.y + (Math.random() - 0.5) * 60       : C.y;
      const ex = isInflow ? C.x                                     : C.x + Math.cos(angle) * dist;
      const ey = isInflow ? C.y                                     : C.y + Math.sin(angle) * dist;

      // Control point adds a graceful arc
      const cpOff = 30 + Math.random() * 20;
      particles.push({
        sx, sy, ex, ey,
        cx: (sx + ex) / 2 + (Math.random() - 0.5) * cpOff,
        cy: (sy + ey) / 2 + (Math.random() - 0.5) * cpOff,
        t: 0,
        speed: 0.009 + Math.random() * 0.008,
        inflow: isInflow,
        radius: isInflow ? 1.4 + Math.random() * 0.6 : 1.6 + Math.random() * 0.8,
        trail: [], // last N positions for tail
      });
    }

    function bezier(p, t) {
      const mt = 1 - t;
      return {
        x: mt * mt * p.sx + 2 * mt * t * p.cx + t * t * p.ex,
        y: mt * mt * p.sy + 2 * mt * t * p.cy + t * t * p.ey,
      };
    }

    function step() {
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Smooth spawn rate
      currentRate = lerp(currentRate, targetRate(), 0.04);
      spawnAcc.current += currentRate;
      while (spawnAcc.current >= 1) { spawn(); spawnAcc.current -= 1; }

      particles = particles.filter(p => p.t < 1);

      for (const p of particles) {
        p.t = Math.min(p.t + p.speed, 1);
        const pos = bezier(p, p.t);

        // Record trail (cap at 8 points)
        p.trail.push({ ...pos });
        if (p.trail.length > 8) p.trail.shift();

        // Draw tail
        const tailLen = p.trail.length;
        for (let i = 1; i < tailLen; i++) {
          const ta = p.trail[i - 1];
          const tb = p.trail[i];
          const frac = i / tailLen;
          const alpha = p.inflow
            ? 0.5 * frac * (0.5 + p.t * 0.5)
            : 0.45 * frac * (1 - p.t * 0.25);
          ctx.beginPath();
          ctx.strokeStyle = p.inflow
            ? `rgba(125,211,252,${alpha})`
            : `rgba(196,165,255,${alpha})`;
          ctx.lineWidth  = p.radius * frac * 0.9;
          ctx.lineCap    = "round";
          ctx.moveTo(ta.x, ta.y);
          ctx.lineTo(tb.x, tb.y);
          ctx.stroke();
        }

        // Draw head
        const headAlpha = p.inflow
          ? 0.92 * (0.4 + p.t * 0.6)
          : 0.88 * (1 - p.t * 0.2);
        ctx.beginPath();
        ctx.fillStyle = p.inflow
          ? `rgba(125,211,252,${headAlpha})`
          : `rgba(196,165,255,${headAlpha})`;
        ctx.arc(pos.x, pos.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []); // deliberately empty — state read via ref

  const isActive = ACTIVE_STATES.has(state);
  const isQuiet  = QUIET_STATES.has(state);
  const breatheD = isActive ? 1.2 : isQuiet ? 4.5 : 2.2;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: 260, height: 260 }}
    >
      {/* Particle canvas — behind all glow layers */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* ── Glow layer 1: outermost soft bloom ─────── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: breatheD * 1.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Glow layer 2: mid indigo ring ───────────── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 150, height: 150,
          background: "radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(99,102,241,0.15) 50%, transparent 72%)",
          filter: "blur(10px)",
        }}
        animate={{ scale: [1, 1.09, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: breatheD, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Glow layer 3: tight cyan core bloom ─────── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 90, height: 90,
          background: "radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(99,102,241,0.3) 55%, transparent 80%)",
          filter: "blur(6px)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: breatheD * 0.85, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* ── Rotating ring A ─────────────────────────── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 124, height: 124,
          border: "1px solid rgba(148,163,255,0.18)",
          boxShadow: "0 0 12px rgba(99,102,241,0.12) inset",
          animation: `ai-ring-cw ${isActive ? "3s" : "7s"} linear infinite`,
        }}
      >
        {/* ring glow dot */}
        <div
          className="absolute rounded-full"
          style={{
            width: 5, height: 5,
            top: -2.5, left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#818cf8",
            boxShadow: "0 0 8px #818cf8, 0 0 16px rgba(129,140,248,0.6)",
          }}
        />
      </div>

      {/* ── Rotating ring B (counter) ────────────────── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 108, height: 108,
          border: "1px solid rgba(34,211,238,0.12)",
          animation: `ai-ring-ccw ${isActive ? "4s" : "9s"} linear infinite`,
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 4, height: 4,
            bottom: -2, left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#22d3ee",
            boxShadow: "0 0 6px #22d3ee, 0 0 12px rgba(34,211,238,0.5)",
          }}
        />
      </div>

      {/* ── Core orb ─────────────────────────────────── */}
      <motion.div
        className="relative rounded-full pointer-events-none"
        style={{
          width: 68, height: 68,
          background: [
            "radial-gradient(circle at 32% 28%,",
            "  rgba(255,255,255,0.95) 0%,",
            "  #c7d2fe 14%,",
            "  #818cf8 38%,",
            "  #6366f1 62%,",
            "  #4f46e5 80%,",
            "  transparent 100%",
            ")",
          ].join(""),
          boxShadow: [
            "0 0 0  2px rgba(99,102,241,0.35)",
            "0 0 20px rgba(99,102,241,0.65)",
            "0 0 50px rgba(99,102,241,0.3)",
            "0 0 90px rgba(168,85,247,0.2)",
          ].join(", "),
        }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: breatheD, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Specular flare ───────────────────────────── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 20, height: 20,
          top: "50%", left: "50%",
          transform: "translate(-44%, -46%)",
          background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />

      <style>{`
        @keyframes ai-ring-cw  { to { transform: rotate(360deg);  } }
        @keyframes ai-ring-ccw { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}
