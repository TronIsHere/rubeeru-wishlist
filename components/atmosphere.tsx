"use client";

/* The dark panel of the main landing: slate mist, blue glow, stars, grain. */

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import s from "./atmosphere.module.css";

export const ease = [0.16, 1, 0.3, 1] as const;
export const fadeText = s.fadeText;
export const ping = s.ping;

/* Deterministic PRNG so the starfield renders identically on server and client. */
function prng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function starsFor(count: number, seed: number) {
  const r = prng(seed);
  return Array.from({ length: count }, () => ({
    left: `${(r() * 100).toFixed(2)}%`,
    top: `${(r() * 100).toFixed(2)}%`,
    size: r() > 0.85 ? 2 : 1,
    o: (0.25 + r() * 0.55).toFixed(2),
    d: `${(3 + r() * 5).toFixed(1)}s`,
    delay: `${(-r() * 8).toFixed(1)}s`,
  }));
}

function Stars({ count, seed }: { count: number; seed: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {starsFor(count, seed).map((st, i) => (
        <span
          key={i}
          className={cn("absolute rounded-full bg-white", s.twinkle)}
          style={{ left: st.left, top: st.top, width: st.size, height: st.size, "--o": st.o, "--d": st.d, "--delay": st.delay } as CSSProperties}
        />
      ))}
    </div>
  );
}

function Mist() {
  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, ease }} aria-hidden>
      <motion.div
        className="absolute -top-[45%] -left-[15%] aspect-square w-[75%] min-w-[460px] rounded-full blur-[50px]"
        style={{ background: "radial-gradient(closest-side, rgba(241,245,249,0.75), rgba(203,213,225,0.45) 35%, rgba(148,163,184,0.18) 62%, transparent 100%)" }}
        animate={{ x: [0, 50, -20, 0], y: [0, 40, 15, 0], scale: [1, 1.07, 0.97, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[18%] -bottom-[55%] aspect-square w-[60%] min-w-[380px] rounded-full blur-[60px]"
        style={{ background: "radial-gradient(closest-side, rgba(77,124,255,0.55), rgba(0,82,255,0.22) 50%, transparent 100%)" }}
        animate={{ x: [0, -40, 10, 0], y: [0, -30, 10, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(118deg, transparent 38%, rgba(0,0,0,0.5) 55%, transparent 72%)" }} />
    </motion.div>
  );
}

/** Dark rounded panel with the full atmosphere behind its children. */
export function MistPanel({ children, className, seed = 7, stars = 70 }: { children: ReactNode; className?: string; seed?: number; stars?: number }) {
  return (
    <div className={cn("relative isolate overflow-hidden text-white", s.ink, className)}>
      <Mist />
      <Stars count={stars} seed={seed} />
      <div className={cn("pointer-events-none absolute inset-0", s.grain)} aria-hidden />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
