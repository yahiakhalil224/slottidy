import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function GlassCard({
  children,
  className,
  lift = true,
}: {
  children: ReactNode
  className?: string
  lift?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(pointer: coarse)").matches) return
    const rect = element.getBoundingClientRect()
    element.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    element.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      data-lift={lift ? "true" : "false"}
      className={cn("glass-card group/card overflow-hidden", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgba(0,209,160,0.16), transparent 42%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
