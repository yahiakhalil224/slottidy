import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const BAR_COUNT = 72

/**
 * Hero visual: a dark glass core with a ring of audio bars that move like speech,
 * a lime light orbiting the outer ring, and soft ripples. Decorative only.
 */
export function VoiceCore({ active, className }: { active: boolean; className?: string }) {
  const bars = useRef<Array<HTMLSpanElement | null>>([])
  const core = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const paint = (scale: (index: number) => number) => {
      bars.current.forEach((bar, index) => {
        if (bar) bar.style.transform = `scaleY(${scale(index).toFixed(3)})`
      })
    }

    if (!active) {
      paint((index) => 0.22 + 0.12 * Math.abs(Math.sin(index * 0.7)))
      if (core.current) core.current.style.setProperty("--level", "0")
      return
    }

    let frame = 0
    const start = performance.now()
    const loop = (now: number) => {
      const t = (now - start) / 1000
      // Speech-like envelope: phrases of ~1.6s with short pauses.
      const phase = t % 2.4
      const envelope = phase < 1.7 ? Math.pow(Math.sin((phase / 1.7) * Math.PI), 0.7) : 0
      paint((index) => {
        const angle = (index / BAR_COUNT) * Math.PI * 2
        const wave =
          0.5 * Math.abs(Math.sin(angle * 3 + t * 2.1)) +
          0.35 * Math.abs(Math.sin(angle * 5 - t * 3.3)) +
          0.15 * Math.abs(Math.sin(angle * 11 + t * 6.2))
        return 0.16 + envelope * wave * 0.95 + 0.04 * Math.sin(t * 1.3 + index)
      })
      if (core.current) core.current.style.setProperty("--level", envelope.toFixed(3))
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [active])

  return (
    <div
      ref={core}
      aria-hidden="true"
      className={cn("voice-core relative aspect-square", className)}
      style={{ ["--level" as string]: 0 }}
    >
      {/* Ambient glow that swells with the voice */}
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(198,244,50,0.35),transparent_68%)] blur-2xl transition-transform duration-300 [transform:scale(calc(0.9+var(--level)*0.25))]" />

      {/* Ripples */}
      {[0, 1, 2].map((ring) => (
        <span
          key={ring}
          className="voice-ripple absolute inset-[22%] rounded-full border border-white/25"
          style={{ animationDelay: `${ring * 1.3}s` }}
        />
      ))}

      {/* Outer hairline ring with an orbiting lime light */}
      <div className="absolute inset-[2%] rounded-full border border-white/10" />
      <div
        className="voice-orbit absolute inset-[2%] rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(198,244,50,0.15) 300deg, #c6f432 358deg, transparent 360deg)",
          maskImage: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
          WebkitMaskImage: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
        }}
      >
        <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-[3px] rounded-full bg-brand shadow-[0_0_14px_4px_rgba(198,244,50,0.7)]" />
      </div>

      {/* Middle dashed ring, counter-rotating */}
      <div className="voice-orbit-reverse absolute inset-[11%] rounded-full border border-dashed border-white/12" />

      {/* Radial audio bars */}
      {Array.from({ length: BAR_COUNT }, (_, index) => (
        <div
          key={index}
          className="absolute inset-[13%]"
          style={{ transform: `rotate(${(index / BAR_COUNT) * 360}deg)` }}
        >
          <span
            ref={(element) => {
              bars.current[index] = element
            }}
            className={cn(
              "absolute top-0 left-1/2 h-[17%] w-[2px] -translate-x-1/2 origin-bottom rounded-full",
              index % 6 === 0 ? "bg-brand" : "bg-white/75",
            )}
            style={{ transform: "scaleY(0.25)" }}
          />
        </div>
      ))}

      {/* Glass core */}
      <div className="absolute inset-[31%] rounded-full border border-white/12 bg-[radial-gradient(circle_at_35%_25%,#2a2a2d,#0b0b0c_70%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_60px_-20px_rgba(0,0,0,0.8),0_0_0_10px_rgba(255,255,255,0.025)]">
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex h-[34%] items-center gap-[6%]" style={{ width: "34%" }}>
            {[0.45, 0.8, 1, 0.65, 0.4].map((height, index) => (
              <span
                key={index}
                className="voice-logo-bar w-full rounded-full bg-white"
                style={{ height: `${height * 100}%`, animationDelay: `${index * 0.14}s` }}
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-x-[18%] top-[4%] h-[38%] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.10),transparent_70%)]" />
      </div>
    </div>
  )
}
