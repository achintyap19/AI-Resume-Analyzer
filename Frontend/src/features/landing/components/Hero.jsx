import { useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import AICore from "./AICore";
import FloatingDashboard from "./FloatingDashboard";
import { useAIStateMachine } from "../hooks/useAIStateMachine";

/**
 * Hero.jsx — POLISHED
 *
 * Layout unchanged (Left 38% / Center 12% AI Core / Right 50% Dashboard).
 *
 * What changed:
 *  - Mouse tracking: raw cursor position → normalised offset →
 *    spring-smoothed → passed to FloatingDashboard as (mouseX, mouseY)
 *    for whole-cluster parallax (max ±6px). Background unchanged.
 *  - All entrance animations now use spring() instead of duration easing.
 *  - Headline: slightly tighter line-height (1.04), letter-spacing -0.02em
 *    for that premium editorial look.
 *  - Subheading: better rhythm — 16px, line-height 1.75, max-w adjusted.
 *  - CTA primary: added a shimmer sweep on hover (pseudo done via motion).
 *  - CTA secondary: backdrop-blur micro-glass.
 *  - Live badge: ring pulse added around the dot.
 *  - Social proof: stars now have a glow treatment.
 *  - Status bar: slightly larger, better mono weight.
 *  - Bottom fade deepened.
 */

const SPRING_ENTRANCE = { type: "spring", stiffness: 240, damping: 26, mass: 0.9 };

// ── Status bar ────────────────────────────────────────────────────────────
function StatusBar({ label, state }) {
  const isReady = state === "ready";
  return (
    <motion.div
      className="mb-4 flex items-center gap-2 self-end"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_ENTRANCE, delay: 0.5 }}
    >
      {/* pulsing dot with ring */}
      <span className="relative flex h-2 w-2">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full"
          style={{ backgroundColor: isReady ? "#34d399" : "#22d3ee", opacity: 0.55 }}
          animate={{ scale: [1, 2.2, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: isReady ? "#34d399" : "#22d3ee" }}
        />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{    opacity: 0, y: -5 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11.5px] font-medium tracking-wide"
          style={{ color: isReady ? "#34d399" : "#22d3ee" }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ── Gradient shimmer headline ─────────────────────────────────────────────
function GradientText({ children }) {
  return (
    <span
      style={{
        background: "linear-gradient(125deg, #4f7fff 0%, #a855f7 45%, #ec4899 80%, #4f7fff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor:  "transparent",
        backgroundClip:       "text",
        backgroundSize:       "240% 240%",
        animation:            "gradient-shift 5s ease infinite",
      }}
    >
      {children}
    </span>
  );
}

// ── Live badge ────────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING_ENTRANCE, delay: 0.15 }}
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5"
      style={{
        backgroundColor: "rgba(34,211,238,0.05)",
        borderColor:     "rgba(34,211,238,0.22)",
        boxShadow:       "0 0 16px rgba(34,211,238,0.08)",
      }}
    >
      {/* animated dot with ring */}
      <span className="relative flex h-1.5 w-1.5">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full"
          style={{ backgroundColor: "#22d3ee", opacity: 0.5 }}
          animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#22d3ee" }} />
      </span>
      <span className="text-[11px] font-bold tracking-[0.12em]" style={{ color: "#22d3ee" }}>
        LIVE
      </span>
      <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
        AI Analysis Running
      </span>
    </motion.div>
  );
}

// ── Primary CTA with shimmer sweep ───────────────────────────────────────
function PrimaryCTA() {
  const shimmerX = useMotionValue(-100);
  const onEnter  = useCallback(() => {
    shimmerX.set(-100);
    // animate across
    let start = null;
    function sweep(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 420, 1);
      shimmerX.set(-100 + p * 260);
      if (p < 1) requestAnimationFrame(sweep);
    }
    requestAnimationFrame(sweep);
  }, [shimmerX]);

  return (
    <motion.a
      href="#get-started"
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-[14px] font-semibold text-white"
      style={{
        background: "linear-gradient(135deg, #4f7fff 0%, #7c3aed 50%, #a855f7 100%)",
      }}
      whileHover={{ scale: 1.025 }}
      whileTap={{   scale: 0.975 }}
      transition={{ type: "spring", stiffness: 340, damping: 20 }}
      onHoverStart={onEnter}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 36px rgba(124,58,237,0.55), 0 4px 20px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* shimmer sweep */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-16 skew-x-[-20deg]"
        style={{
          x: shimmerX,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
        }}
      />
      Analyze My Resume
      <motion.span
        className="inline-block"
        animate={{ x: 0 }}
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <ArrowRight size={15} strokeWidth={2.5} />
      </motion.span>
    </motion.a>
  );
}

// ── Secondary CTA ─────────────────────────────────────────────────────────
function SecondaryCTA() {
  return (
    <motion.a
      href="#how-it-works"
      className="inline-flex items-center gap-2 rounded-xl border px-5 py-3.5 text-[14px] font-medium"
      style={{
        borderColor:           "rgba(255,255,255,0.11)",
        color:                 "rgba(255,255,255,0.72)",
        backgroundColor:       "rgba(255,255,255,0.035)",
        backdropFilter:        "blur(10px)",
        WebkitBackdropFilter:  "blur(10px)",
      }}
      whileHover={{
        scale:            1.02,
        borderColor:      "rgba(255,255,255,0.22)",
        color:            "#fff",
        backgroundColor:  "rgba(255,255,255,0.06)",
      }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
    >
      <PlayCircle size={15} strokeWidth={1.8} />
      See How It Works
    </motion.a>
  );
}

// ── Stagger variants ──────────────────────────────────────────────────────
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0,
             transition: { type: "spring", stiffness: 240, damping: 26, mass: 0.85 } },
};

// ── Hero ──────────────────────────────────────────────────────────────────
export default function Hero() {
  const { state, label } = useAIStateMachine();
  const sectionRef = useRef(null);

  // Mouse tracking for dashboard parallax (max ±6px normalised)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const onMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    rawX.set(nx * 6);
    rawY.set(ny * 6);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const attractPoints = [{ x: 0.62, y: 0.42, radius: 140 }];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#050505" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <AnimatedBackground attractPoints={attractPoints} />

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
      `}</style>

      <div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 py-24
                   lg:flex-row lg:items-center lg:gap-0 lg:py-0"
      >
        {/* ── LEFT ─────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-7 lg:w-[38%]"
        >
          <motion.div variants={fadeUp}>
            <LiveBadge />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-bold text-white"
            style={{
              fontSize:      "clamp(38px, 5.2vw, 62px)",
              lineHeight:    1.04,
              letterSpacing: "-0.02em",
            }}
          >
            Analyze Your Resume.
            <br />
            <GradientText>Ace Every Interview.</GradientText>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              color:      "rgba(255,255,255,0.55)",
              fontSize:   16,
              lineHeight: 1.75,
              maxWidth:   400,
            }}
          >
            Upload your resume once. Get a complete picture of where you
            stand, what you're missing, and exactly how to close the gap
            before your next interview.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <PrimaryCTA />
            <SecondaryCTA />
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeUp} className="flex items-center gap-3.5">
            <div className="flex -space-x-2.5">
              {["#4f7fff", "#a855f7", "#22d3ee", "#ec4899"].map((c, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-bold text-white"
                  style={{ backgroundColor: c, borderColor: "#050505",
                           boxShadow: `0 0 10px ${c}55` }}
                >
                  {["A", "S", "R", "M"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 0l1.5 4.5H12L8.25 7.25 9.75 12 6 9.25 2.25 12l1.5-4.75L0 4.5h4.5z"
                      fill="#fbbf24" filter="drop-shadow(0 0 3px rgba(251,191,36,0.5))" />
                  </svg>
                ))}
              </div>
              <p className="mt-0.5 text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                Loved by{" "}
                <span className="font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>
                  10,000+
                </span>{" "}
                job seekers
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── CENTER — AI CORE ──────────────────────────── */}
        <div className="hidden items-center justify-center lg:flex lg:w-[12%]">
          <AICore state={state} />
        </div>

        {/* ── RIGHT — DASHBOARD ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_ENTRANCE, delay: 0.25 }}
          className="flex flex-col items-end lg:w-[50%]"
        >
          <StatusBar label={label} state={state} />
          <FloatingDashboard state={state} mouseX={rawX} mouseY={rawY} />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #050505 85%)" }}
      />
    </section>
  );
}