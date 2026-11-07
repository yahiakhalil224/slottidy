import { cn } from "@/lib/utils"

/**
 * Branded lime light effect for midnight-black sections: a glow rising from the
 * bottom centre with vertical light streaks running through it.
 * Purely decorative; place inside a `relative overflow-hidden` parent.
 */
export function LimeStreaks({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[78%] overflow-hidden",
        className,
      )}
    >
      {/* Soft base glow */}
      <div className="absolute bottom-[-30%] left-1/2 h-[90%] w-[min(1200px,140%)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(198,244,50,0.85),rgba(198,244,50,0.32)_38%,transparent_70%)] blur-2xl" />

      {/* Vertical streaks, faded into an arch from the bottom centre */}
      <div
        className="lime-streaks absolute bottom-0 left-1/2 h-full w-[min(1100px,130%)] -translate-x-1/2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 7px, rgba(214,255,90,0.9) 7px 8px, transparent 8px 13px, rgba(198,244,50,0.5) 13px 15px)",
          maskImage:
            "radial-gradient(ellipse 50% 100% at 50% 100%, #000 0%, rgba(0,0,0,0.7) 45%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 50% 100% at 50% 100%, #000 0%, rgba(0,0,0,0.7) 45%, transparent 80%)",
        }}
      />

      {/* Brighter core beam */}
      <div className="absolute bottom-0 left-1/2 h-[60%] w-[34%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_100%,rgba(198,244,50,0.75),transparent_70%)] blur-xl mix-blend-screen" />

      {/* Horizon line */}
      <div className="absolute bottom-0 left-1/2 h-px w-[min(900px,100%)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(198,244,50,0.9),transparent)]" />
    </div>
  )
}
