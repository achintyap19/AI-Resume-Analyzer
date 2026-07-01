import { useState, useEffect, useRef } from "react";

/**
 * useAIStateMachine.js
 * Drives the hero's "Live AI Analysis" cycle. AICore and FloatingDashboard
 * both consume the same state so their animations stay perfectly in sync.
 *
 * Cycle: IDLE → UPLOADING → EXTRACTING → COMPARING → DETECTING → GENERATING
 *        → CALCULATING → READY → (soft reset to IDLE)
 */

export const AI_STATES = [
  { key: "idle", label: "Waiting for resume", duration: 3000 },
  { key: "uploading", label: "Uploading resume.pdf", duration: 2200 },
  { key: "extracting", label: "Extracting skills...", duration: 3200 },
  { key: "comparing", label: "Comparing with job description...", duration: 3200 },
  { key: "detecting", label: "Detecting skill gaps...", duration: 3000 },
  { key: "generating", label: "Generating interview questions...", duration: 3600 },
  { key: "calculating", label: "Calculating match score...", duration: 2800 },
  { key: "ready", label: "Report ready", duration: 4000 },
];

export function useAIStateMachine() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const current = AI_STATES[index];
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % AI_STATES.length);
    }, current.duration);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  return {
    state: AI_STATES[index].key,
    label: AI_STATES[index].label,
    index,
  };
}
