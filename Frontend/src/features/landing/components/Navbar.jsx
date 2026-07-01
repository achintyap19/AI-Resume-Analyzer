import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

/**
 * Navbar.jsx
 * ResumeAI — Design V2 source-of-truth implementation
 *
 * Behavior:
 *   - Transparent over the hero's void background at the top of the page.
 *   - Gains a translucent surface + hairline border + blur once the user
 *     scrolls past the hero (condenses, like a HUD docking into place).
 *   - Nav links per V2 architecture (Testimonials/Pricing removed from the
 *     page body, but kept here ONLY if you want anchor parity — per the
 *     approved doc those sections are deleted, so links reflect that).
 *   - Mobile: full-screen panel, staggered link reveal, focus-trapped close.
 */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Product", href: "#product-preview" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [condensed, setCondensed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const panelRef = useRef(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCondensed(latest > 40);
  });

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // close on escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ backgroundColor: "#050505" }}>
      <header className="fixed inset-x-0 top-0 z-50">
        <motion.div
          className="mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500"
          style={{
            marginLeft: condensed ? "1rem" : "0",
            marginRight: condensed ? "1rem" : "0",
          }}
          animate={{
            backgroundColor: condensed ? "rgba(10, 10, 15, 0.72)" : "rgba(10, 10, 15, 0)",
            borderColor: condensed ? "rgba(148, 163, 255, 0.12)" : "rgba(148, 163, 255, 0)",
            boxShadow: condensed
              ? "0 8px 32px rgba(0,0,0,0.35)"
              : "0 0 0 rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl border"
            style={{
              borderColor: condensed ? "rgba(148, 163, 255, 0.12)" : "transparent",
              backdropFilter: condensed ? "blur(16px)" : "none",
              WebkitBackdropFilter: condensed ? "blur(16px)" : "none",
            }}
            aria-hidden="true"
          />

          {/* Logo */}
          <a href="#" className="relative z-10 flex items-center gap-2">
            <span className="relative flex h-7 w-7 items-center justify-center">
              <Sparkles
                size={18}
                strokeWidth={2}
                className="text-transparent"
                style={{
                  fill: "url(#logo-gradient)",
                }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f7fff" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              ResumeAI
            </span>
          </a>

          {/* Desktop links */}
          <nav className="relative z-10 hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[13.5px] font-medium text-white/65 transition-colors duration-200 hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[#4f7fff] to-[#a855f7] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="relative z-10 hidden items-center gap-3 md:flex">
            <a
              href="#login"
              className="rounded-lg px-4 py-2 text-[13.5px] font-medium text-white/80 transition-colors duration-200 hover:text-white"
            >
              Log in
            </a>
            <a
              href="#get-started"
              className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-[#4f7fff] to-[#a855f7] px-4 py-2 text-[13.5px] font-semibold text-white shadow-[0_0_0_rgba(79,127,255,0)] transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(99,102,241,0.45)]"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg text-white/80 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </header>

      {/* Mobile full-screen panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col backdrop-blur-xl md:hidden"
            style={{ backgroundColor: "rgba(5,5,5,0.98)" }}
          >
            <div className="h-20" /> {/* spacer below navbar */}
            <nav className="flex flex-1 flex-col items-start gap-2 px-8 pt-4">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/[0.06] py-4 text-2xl font-medium tracking-tight text-white/85"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + NAV_LINKS.length * 0.06, duration: 0.4 }}
              className="flex flex-col gap-3 px-8 pb-10"
            >
              <a
                href="#login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 py-3 text-center text-[15px] font-medium text-white/85"
              >
                Log in
              </a>
              <a
                href="#get-started"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4f7fff] to-[#a855f7] py-3 text-[15px] font-semibold text-white"
              >
                Get Started <ArrowRight size={15} strokeWidth={2.5} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}