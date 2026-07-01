import { useRef, useEffect } from "react";

/**
 * AnimatedBackground.jsx
 * ResumeAI — Design V2 source-of-truth implementation
 *
 * Layers (back to front):
 *   1. Void background (set by parent / body — this component is transparent)
 *   2. Aurora blobs — noise-distorted, volumetric, cursor-parallax (0.008x)
 *   3. Dot grid — cursor repulsion, proximity connections, traveling particles,
 *      optional gravity wells (e.g. the Hero's AI Core attracts nearby dots)
 *
 * Usage:
 *   <div className="relative">
 *     <AnimatedBackground attractPoints={[{ x: 0.62, y: 0.42, radius: 160 }]} />
 *     <YourContent />
 *   </div>
 *
 * Notes:
 *   - Canvas-driven dot grid (not per-dot DOM nodes) for performance at this density.
 *   - Respects prefers-reduced-motion: falls back to a static grid + static aurora.
 *   - Fully self-contained: no external assets, no extra deps beyond React.
 */

// ---- Design tokens (Deep Signal palette) -------------------------------
const TOKENS = {
  dotBase: "148, 163, 255", // pale blue-violet, rgb triplet for alpha control
  dotBright: "34, 211, 238", // electric cyan, used near cursor / gravity wells
  particle: "255, 255, 255",
  connection: "129, 140, 248", // indigo
  auroraA: ["#3b82f6", "#6366f1"], // electric blue → indigo (upper field)
  auroraB: ["#4f46e5", "#7c3aed"], // violet → pink (lower-right field)
};

// ---- Tunables -----------------------------------------------------------
const GRID_SPACING = 20; // px between dots at base density
const DOT_RADIUS = 0.9;
const REPEL_RADIUS = 70;
const REPEL_STRENGTH = 20;
const RETURN_EASE = 0.10;
const CONNECT_RADIUS =75;
const CONNECT_CHANCE_PER_FRAME = 0.0009; // stochastic, not choreographed
const PARTICLE_CHANCE_ON_CONNECT = 0.3;
const PARTICLE_DURATION_MS = 600;
const GRAVITY_STRENGTH = 22;

function usePrefersReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    ref.current = mq.matches;
    const onChange = (e) => (ref.current = e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return ref;
}

export default function AnimatedBackground({
  attractPoints = [], // [{ x: 0-1, y: 0-1, radius?: px }] — normalized to canvas size
  className = "",
}) {
  const canvasRef = useRef(null);
  const auroraARef = useRef(null);
  const auroraBRef = useRef(null);
  const wrapRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let dots = [];
    let connections = []; // { a, b, particle: { t, active } }
    const mouse = { x: -9999, y: -9999, active: false };

    function buildGrid() {
      dots = [];
      const cols = Math.ceil(width / GRID_SPACING) + 2;
      const rows = Math.ceil(height / GRID_SPACING) + 2;
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
         const x =
  i * GRID_SPACING + (Math.random() - 0.5) * 3;

const y =
  j * GRID_SPACING + (Math.random() - 0.5) * 3;
          // density bias: slightly denser center-right (hero focal gravity)
          const focalX = width * 0.62;
          const focalY = height * 0.45;
          const dFocal = Math.hypot(x - focalX, y - focalY);
          const keepProb = dFocal < width * 0.35 ? 1 : 0.86;
          if (Math.random() > keepProb) continue;
          dots.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            alpha: 0.15 + Math.random() * 0.45,
            radius: DOT_RADIUS + Math.random() * 0.45,
            layer: Math.random(),
          });
        }
      }
    }

    function resize() {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function onMouseMove(e) {
      const rect = wrap.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      // aurora parallax — 0.008x cursor offset
      const cx = mouse.x - width / 2;
      const cy = mouse.y - height / 2;
      if (auroraARef.current) {
        auroraARef.current.style.transform = `translate3d(${cx * 0.008}px, ${
          cy * 0.008
        }px, 0)`;
      }
      if (auroraBRef.current) {
        auroraBRef.current.style.transform = `translate3d(${cx * -0.008}px, ${
          cy * -0.008
        }px, 0)`;
      }
    }

    function onMouseLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      const gravityWells = attractPoints.map((p) => ({
        x: p.x * width,
        y: p.y * height,
        radius: p.radius || 100,
      }));

      for (const dot of dots) {
        // cursor repulsion
        if (mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < REPEL_RADIUS) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            dot.vx += (dx / dist) * force * 0.06;
            dot.vy += (dy / dist) * force * 0.06;
          }
        }

        // gravity wells (e.g. AI Core) — gentle attraction, opposite of repulsion
        for (const well of gravityWells) {
          const dx = well.x - dot.x;
          const dy = well.y - dot.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < well.radius * 2.2 && dist > well.radius * 0.3) {
            const force = (1 - dist / (well.radius * 2.2)) * GRAVITY_STRENGTH;
            dot.vx += (dx / dist) * force * 0.02;
            dot.vy += (dy / dist) * force * 0.02;
          }
        }

        // return toward origin
        dot.vx += (dot.ox - dot.x) * RETURN_EASE * 0.12;
        dot.vy += (dot.oy - dot.y) * RETURN_EASE * 0.12;

        // damping
        dot.vx *= 0.88;
        dot.vy *= 0.88;

        dot.x += dot.vx;
        dot.y += dot.vy;
      }

      // stochastic proximity connections
      if (!reducedMotion.current && Math.random() < CONNECT_CHANCE_PER_FRAME * dots.length) {
        const a = dots[(Math.random() * dots.length) | 0];
        let nearest = null;
        let nearestDist = CONNECT_RADIUS;
        for (const b of dots) {
          if (b === a) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = b;
          }
        }
        if (nearest) {
          connections.push({
            a,
            b: nearest,
            createdAt: performance.now(),
            life: 900,
            particle:
              Math.random() < PARTICLE_CHANCE_ON_CONNECT
                ? { start: performance.now(), active: true }
                : null,
          });
        }
      }

      const now = performance.now();
      connections = connections.filter((c) => now - c.createdAt < c.life);

      // draw dots
      ctx.fillStyle = `rgba(${TOKENS.dotBase}, 0.45)`;
      for (const dot of dots) {
        const distToMouse = mouse.active
          ? Math.hypot(dot.x - mouse.x, dot.y - mouse.y)
          : Infinity;
        const isBright = distToMouse < REPEL_RADIUS * 1.3;
        const heroX = width * 0.32;
        const heroY = height * 0.34;

        const heroDistance = Math.hypot(
            dot.x - heroX,
            dot.y - heroY
        );
        ctx.beginPath();
        let alpha = dot.alpha;

        if (heroDistance < 240) {
            alpha += (1 - heroDistance / 240) * 0.25;
        }

        ctx.fillStyle = isBright
            ? `rgba(${TOKENS.dotBright}, ${Math.min(alpha + 0.4,1)})`
            : `rgba(${TOKENS.dotBase}, ${Math.min(alpha,1)})`;
        ctx.arc(
              dot.x,
              dot.y,
              isBright
                  ? dot.radius*1.1
                  : dot.radius,
              0,
              Math.PI*2
          )
        ctx.fill();
      }

      // draw connections + traveling particles
      for (const c of connections) {
        const age = now - c.createdAt;
        const fade = 1 - age / c.life;
        ctx.strokeStyle = `rgba(${TOKENS.connection}, ${0.15 * fade})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(c.a.x, c.a.y);
        ctx.lineTo(c.b.x, c.b.y);
        ctx.stroke();

        if (c.particle?.active) {
          const pAge = now - c.particle.start;
          const t = pAge / PARTICLE_DURATION_MS;
          if (t >= 1) {
            c.particle.active = false;
          } else {
            const px = c.a.x + (c.b.x - c.a.x) * t;
            const py = c.a.y + (c.b.y - c.a.y) * t;
            ctx.beginPath();
            ctx.fillStyle = `rgba(${TOKENS.particle}, 0.85)`;
            ctx.arc(px, py, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(step);
    }

    let raf;
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    if (reducedMotion.current) {
      // static single render, no animation loop
      step();
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attractPoints]);

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Void background fill — makes this self-contained in isolated previews;
          harmless when composed under real page content that's already dark */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at 18% 18%,
              rgba(59,130,246,0.08),
              transparent 38%
            ),
            #050505
          `,
        }}
/>
      {/* SVG filter for aurora noise distortion */}
      <svg width="0" height="0" className="absolute">
        <filter id="aurora-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="7"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.012;0.016;0.012"
              dur="8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" />
        </filter>
      </svg>

      
      {/* Dot grid canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <style>{`
        @keyframes aurora-drift-a {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(2%, -3%); }
        }
        @keyframes aurora-drift-b {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-2%, 3%); }
        }
      `}</style>
    </div>
  );
}
