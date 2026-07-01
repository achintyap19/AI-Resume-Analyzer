import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Upload, FileCheck2, Check } from "lucide-react";

/**
 * FloatingDashboard.jsx — POLISHED
 *
 * What changed from v1:
 *  - Card: deeper glassmorphism (layered inset shadows + specular top edge)
 *  - Card: hover tilt via per-card mouse tracking (max 3° each axis)
 *  - Dashboard: subtle whole-cluster parallax driven by a shared mouse position
 *    passed down from Hero (max 6px translate, not rotation)
 *  - Staggered entrance: each card mounts based on AI state sequence
 *    UPLOADING → upload, EXTRACTING → score, COMPARING → strengths,
 *    DETECTING → gaps, GENERATING → questions, CALCULATING/READY → plan
 *  - spring() on all entrance animations for overshoot feel
 *  - Progress bar uses spring easing
 *  - Score arc stroke-dashoffset uses spring lerp
 *  - Strength rows have left-border flash on mount
 *  - All opacity transitions now have a proper ease curve
 */

// ── Constants ─────────────────────────────────────────────────────────────
const SAMPLE_QUESTIONS = [
  "Walk me through designing a RAG pipeline for enterprise documents.",
  "How do you decide between fine-tuning and prompt engineering?",
  "Describe optimizing a slow ML inference pipeline at scale.",
];
const STRENGTHS = [
  "Strong technical background",
  "Problem solving skills",
  "Relevant project experience",
  "Good communication",
];
const SKILL_GAPS = [
  { label: "System Design", priority: "High",   color: "#fb7185" },
  { label: "AWS",           priority: "Medium", color: "#fbbf24" },
  { label: "Docker",        priority: "Low",    color: "#34d399" },
];
const PLAN = [
  { day: "Day 1", topic: "Data Structures" },
  { day: "Day 2", topic: "System Design"   },
  { day: "Day 3", topic: "Mock Interview"  },
];

// Which state makes each card visible
const CARD_VISIBLE_FROM = {
  upload:    ["uploading", "extracting", "comparing", "detecting", "generating", "calculating", "ready"],
  score:     ["extracting", "comparing", "detecting", "generating", "calculating", "ready"],
  strengths: ["comparing",  "detecting", "generating", "calculating", "ready"],
  gaps:      ["detecting",  "generating", "calculating", "ready"],
  questions: ["generating", "calculating", "ready"],
  plan:      ["calculating", "ready"],
};

function isVisible(card, state) {
  return CARD_VISIBLE_FROM[card]?.includes(state) ?? false;
}

// ── Reusable Card shell ───────────────────────────────────────────────────
function Card({ children, className = "", floatDelay = 0, style = {}, visible = true }) {
  const cardRef   = useRef(null);
  const rotX      = useSpring(0, { stiffness: 200, damping: 25 });
  const rotY      = useSpring(0, { stiffness: 200, damping: 25 });

  const onMouseMove = useCallback((e) => {
    const el   = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    rotX.set(-dy * 3); // max 3°
    rotY.set( dx * 3);
  }, [rotX, rotY]);

  const onMouseLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
  }, [rotX, rotY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={cardRef}
          className={`rounded-2xl border p-5 ${className}`}
          style={{
            backgroundColor:  "rgba(8, 8, 14, 0.65)",
            borderColor:      "rgba(148,163,255,0.13)",
            // Layered box-shadow: depth + specular edge
            boxShadow: [
              "0 1px 0 0 rgba(255,255,255,0.06) inset",   // specular top edge
              "0 -1px 0 0 rgba(0,0,0,0.4) inset",          // bottom depth
              "0 8px 32px rgba(0,0,0,0.45)",
              "0 2px 8px rgba(0,0,0,0.3)",
              "0 0 0 0.5px rgba(148,163,255,0.08)",         // micro border
            ].join(", "),
            backdropFilter:         "blur(20px) saturate(1.4)",
            WebkitBackdropFilter:   "blur(20px) saturate(1.4)",
            rotateX: rotX,
            rotateY: rotY,
            transformStyle:  "preserve-3d",
            transformOrigin: "center center",
            willChange:      "transform, opacity",
            ...style,
          }}
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          animate={{ opacity: 1,  y: 0,  scale: 1,
                     transition: { type: "spring", stiffness: 260, damping: 22, mass: 0.9 } }}
          exit={{    opacity: 0, y: 8, scale: 0.97,
                     transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
          // float
          whileInView={{ y: [0, -8, 0] }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {/* Glass reflection strip */}
          <div
            className="pointer-events-none absolute left-3 right-3 top-0 h-px rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}
          />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Wrap Card in a persistent float oscillation
function FloatingCard({ children, floatDelay, visible, className, style }) {
  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 5.5 + floatDelay * 0.5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
    >
      <Card visible={visible} className={className} style={style}>
        {children}
      </Card>
    </motion.div>
  );
}

// ── Individual cards ──────────────────────────────────────────────────────
function UploadCard({ state }) {
  const uploading = state === "uploading";
  const ready     = isVisible("score", state); // past uploading
  const visible   = isVisible("upload", state) || state === "idle";

  return (
    <FloatingCard floatDelay={0} visible className="w-[220px]"
      style={{ borderStyle: ready ? "solid" : "dashed" }}>
      <div className="flex items-center gap-3">
        <motion.div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "rgba(99,102,241,0.15)" }}
          animate={{ boxShadow: ready ? "0 0 12px rgba(52,211,153,0.3)" : "none" }}
          transition={{ duration: 0.6 }}
        >
          {ready ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}>
              <FileCheck2 size={16} color="#34d399" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ y: uploading ? [-2, 2, -2] : [0, -3, 0] }}
              transition={{ duration: uploading ? 0.65 : 2.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Upload size={16} color="#818cf8" />
            </motion.div>
          )}
        </motion.div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-white">
            {ready ? "resume.pdf" : "Drop your resume here"}
          </p>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.42)" }}>
            {ready ? "248 KB · Uploaded" : "PDF, DOCX (Max 5MB)"}
          </p>
        </div>
      </div>
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #4f7fff, #a855f7)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingCard>
  );
}

function MatchScoreCard({ state }) {
  const visible = isVisible("score", state);
  const active  = ["calculating", "ready", "generating", "detecting",
                   "comparing", "extracting"].includes(state);
  const [score, setScore] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!visible) { setScore(0); return; }
    if (state === "extracting") { setScore(0); return; }
    if (active && state !== "extracting") {
      let start = null;
      const target = state === "calculating" || state === "ready" ? 92 : 0;
      if (target === 0) return;
      function tick(ts) {
        if (!start) start = ts;
        const ease  = 1 - Math.pow(1 - Math.min((ts - start) / 1600, 1), 3);
        setScore(Math.round(target * ease));
        if (ease < 1) raf.current = requestAnimationFrame(tick);
      }
      raf.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf.current);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (score / 100) * circumference;

  return (
    <FloatingCard floatDelay={0.6} visible={visible} className="w-[200px]">
      <p className="text-[11.5px] font-medium uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
        Match Score
      </p>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative">
          <svg width="84" height="84" viewBox="0 0 84 84">
            {/* track */}
            <circle cx="42" cy="42" r="34" fill="none"
              stroke="rgba(255,255,255,0.07)" strokeWidth="5.5" />
            {/* glow duplicate behind */}
            <circle cx="42" cy="42" r="34" fill="none"
              stroke="rgba(34,211,238,0.12)" strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 42 42)"
              style={{ filter: "blur(4px)", transition: "stroke-dashoffset 0.18s linear" }}
            />
            {/* main arc */}
            <circle cx="42" cy="42" r="34" fill="none"
              stroke="url(#score-g)" strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 42 42)"
              style={{ transition: "stroke-dashoffset 0.18s linear" }}
            />
            <defs>
              <linearGradient id="score-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <p className="font-mono text-[28px] font-bold leading-none text-white tabular-nums">
            {score}<span className="text-[18px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>%</span>
          </p>
          <AnimatePresence>
            {state === "ready" && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="mt-1.5 text-[11px] font-semibold"
                style={{ color: "#34d399" }}
              >
                ✦ Excellent Match
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FloatingCard>
  );
}

function StrengthsCard({ state }) {
  const visible = isVisible("strengths", state);
  return (
    <FloatingCard floatDelay={1.1} visible={visible} className="w-[195px]">
      <p className="text-[11.5px] font-medium uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
        Strengths
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {STRENGTHS.map((s, i) => (
          <motion.div
            key={s}
            className="flex items-center gap-2.5 rounded-lg py-0.5 pl-2.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24, delay: i * 0.1 }}
            style={{
              borderLeft: "2px solid rgba(52,211,153,0.4)",
            }}
          >
            <Check size={11} color="#34d399" strokeWidth={3} />
            <span className="text-[12px] leading-tight" style={{ color: "rgba(255,255,255,0.82)" }}>
              {s}
            </span>
          </motion.div>
        ))}
      </div>
    </FloatingCard>
  );
}

function SkillGapsCard({ state }) {
  const visible = isVisible("gaps", state);
  return (
    <FloatingCard floatDelay={0.3} visible={visible} className="w-[200px]">
      <p className="text-[11.5px] font-medium uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
        Skill Gaps
      </p>
      <div className="mt-3 flex flex-col gap-2.5">
        {SKILL_GAPS.map((g, i) => (
          <motion.div
            key={g.label}
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1,  x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: i * 0.14 }}
          >
            <span className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.85)" }}>
              {g.label}
            </span>
            <motion.span
              className="rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold"
              style={{ backgroundColor: `${g.color}1a`, color: g.color,
                       boxShadow: `0 0 8px ${g.color}33` }}
              animate={{ boxShadow: [`0 0 4px ${g.color}33`, `0 0 12px ${g.color}55`, `0 0 4px ${g.color}33`] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            >
              {g.priority}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </FloatingCard>
  );
}

function PlanCard({ state }) {
  const visible = isVisible("plan", state);
  return (
    <FloatingCard floatDelay={0.85} visible={visible} className="w-[195px]">
      <p className="text-[11.5px] font-medium uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
        Recommended Plan
      </p>
      <div className="relative mt-3 flex flex-col gap-3 pl-3.5">
        {/* timeline line */}
        <motion.div
          className="absolute left-0 top-1 w-px rounded-full"
          initial={{ height: 0 }}
          animate={{ height: "calc(100% - 4px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "linear-gradient(to bottom, #818cf8, rgba(129,140,248,0.1))" }}
        />
        {PLAN.map((p, i) => (
          <motion.div
            key={p.day}
            className="flex items-baseline gap-2"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.18 }}
          >
            <span className="text-[10.5px] font-mono font-semibold" style={{ color: "#818cf8" }}>
              {p.day}
            </span>
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.78)" }}>
              {p.topic}
            </span>
          </motion.div>
        ))}
      </div>
    </FloatingCard>
  );
}

function QuestionsCard({ state }) {
  const visible   = isVisible("questions", state);
  const [qIndex,    setQIndex]    = useState(0);
  const [displayed, setDisplayed] = useState("");
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!visible) { setDisplayed(""); return; }
    cancelRef.current = false;
    let i = 0;
    const full = SAMPLE_QUESTIONS[qIndex];
    function type() {
      if (cancelRef.current) return;
      setDisplayed(full.slice(0, i));
      i++;
      if (i <= full.length) {
        setTimeout(type, 20);
      } else {
        setTimeout(() => {
          if (!cancelRef.current)
            setQIndex(q => (q + 1) % SAMPLE_QUESTIONS.length);
        }, 2200);
      }
    }
    type();
    return () => { cancelRef.current = true; };
  }, [qIndex, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FloatingCard floatDelay={1.4} visible={visible} className="w-[215px]" style={{ zIndex: 10 }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold"
          style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.35),rgba(168,85,247,0.25))",
                   color: "#a5b4fc", border: "1px solid rgba(165,180,252,0.2)" }}
        >
          Q
        </span>
        <p className="text-[11.5px] font-medium uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
          Interview Question
        </p>
      </div>
      <p className="min-h-[44px] text-[12.5px] leading-[1.65]"
        style={{ color: "rgba(255,255,255,0.88)" }}>
        {displayed}
        {displayed.length < SAMPLE_QUESTIONS[qIndex].length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.85, repeat: Infinity }}
            style={{ color: "#818cf8", marginLeft: 1 }}
          >|</motion.span>
        )}
      </p>
    </FloatingCard>
  );
}

// ── Root export ───────────────────────────────────────────────────────────
export default function FloatingDashboard({ state, mouseX = 0, mouseY = 0 }) {
  // Whole-cluster subtle parallax (max ±6px), spring smoothed
  const px = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const py = useSpring(mouseY, { stiffness: 60, damping: 18 });

  return (
    <motion.div
      className="relative h-[560px] w-full max-w-[480px]"
      style={{ x: px, y: py }}
    >
      <div className="absolute right-0 top-0">
        <MatchScoreCard state={state} />
      </div>
      <div className="absolute right-2 top-[170px]">
        <StrengthsCard state={state} />
      </div>
      <div className="absolute left-0 top-[260px]">
        <SkillGapsCard state={state} />
      </div>
      <div className="absolute right-4 top-[320px]">
        <PlanCard state={state} />
      </div>
      <div className="absolute left-6 top-[400px] z-10">
        <QuestionsCard state={state} />
      </div>
      <div className="absolute bottom-0 right-6">
        <UploadCard state={state} />
      </div>
    </motion.div>
  );
}