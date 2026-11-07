import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

const STREAK_PATTERN =
  "repeating-linear-gradient(90deg, transparent 0 7px, rgba(214,255,90,0.9) 7px 8px, transparent 8px 13px, rgba(198,244,50,0.5) 13px 15px)"

const ARCH_MASK =
  "radial-gradient(ellipse 50% 100% at 50% 100%, #000 0%, rgba(0,0,0,0.7) 45%, transparent 80%)"

// Rising light beams: [left %, height %, duration s, delay s, width px]
const beams: Array<[number, number, number, number, number]> = [
  [28, 27, 6.5, 0, 1],
  [36, 37, 5.2, 1.6, 2],
  [42, 22, 7.4, 3.1, 1],
  [47, 42, 4.6, 0.8, 2],
  [50, 33, 6.1, 2.4, 1],
  [53, 39, 5.4, 4.2, 2],
  [58, 25, 6.8, 1.1, 1],
  [64, 34, 5.8, 3.6, 2],
  [72, 24, 7.2, 2.0, 1],
]

/**
 * Branded lime light effect for midnight-black sections: a breathing glow rising from the
 * bottom centre, vertical streaks that sway with a light sweeping across them, and thin
 * beams of light travelling upward. Decorative only; place inside a `relative overflow-hidden`
 * parent. All motion stops for prefers-reduced-motion (see index.css).
 */
export function LimeStreaks({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-[78%] overflow-hidden", className)}
    >
      {/* Breathing base glow */}
      <div className="streak-glow absolute bottom-[-30%] left-1/2 h-[90%] w-[min(1200px,140%)] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(198,244,50,0.85),rgba(198,244,50,0.32)_38%,transparent_70%)] blur-2xl" />

      {/* Swaying vertical streaks */}
      <div
        className="streak-sway absolute bottom-0 left-1/2 h-full w-[min(1100px,130%)]"
        style={{ backgroundImage: STREAK_PATTERN, maskImage: ARCH_MASK, WebkitMaskImage: ARCH_MASK }}
      />

      {/* A brighter copy of the streaks, revealed by a light that sweeps side to side */}
      <div
        className="streak-sway absolute bottom-0 left-1/2 h-full w-[min(1100px,130%)]"
        style={{ maskImage: ARCH_MASK, WebkitMaskImage: ARCH_MASK }}
      >
        <div
          className="streak-sweep absolute inset-0"
          style={
            {
              backgroundImage: STREAK_PATTERN,
              filter: "brightness(1.6) saturate(1.2)",
              maskImage: "radial-gradient(ellipse 18% 90% at 50% 100%, #000, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse 18% 90% at 50% 100%, #000, transparent 70%)",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            } as CSSProperties
          }
        />
      </div>

      {/* Rising beams */}
      {beams.map(([left, height, duration, delay, width]) => (
        <span
          key={`${left}-${delay}`}
          className="streak-beam absolute bottom-0 rounded-full bg-[linear-gradient(to_top,transparent,rgba(214,255,90,0.85)_45%,rgba(255,255,255,0.7)_60%,transparent)]"
          style={
            {
              left: `${left}%`,
              width,
              height: `${height}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              boxShadow: "0 0 12px rgba(198,244,50,0.8)",
            } as CSSProperties
          }
        />
      ))}

      {/* Brighter core beam */}
      <div className="streak-glow absolute bottom-0 left-1/2 h-[60%] w-[34%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(198,244,50,0.75),transparent_70%)] mix-blend-screen blur-xl [animation-delay:-3s]" />

      {/* Horizon line */}
      <div className="absolute bottom-0 left-1/2 h-px w-[min(900px,100%)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(198,244,50,0.9),transparent)]" />
    </div>
  )
}
