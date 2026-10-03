import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function SpeechWave({
  count = 48,
  active,
  className,
}: {
  count?: number
  active: boolean
  className?: string
}) {
  const bars = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    const paint = (scale: (index: number, time: number) => number, time = 0) => {
      bars.current.forEach((bar, index) => {
        if (!bar) return
        bar.style.transform = `scaleY(${scale(index, time)})`
      })
    }

    if (!active) {
      paint((index) => 0.16 + ((index * 13) % 8) * 0.035)
      return
    }

    let frame = 0
    const start = performance.now()
    const loop = (now: number) => {
      const time = (now - start) / 1000
      const phase = time % 2.6
      const speaking = phase < 1.5
      const envelope = speaking ? Math.sin((phase / 1.5) * Math.PI) : 0
      paint((index) => {
        const noise = Math.abs(
          Math.sin(time * 2.35 + index * 0.48) * Math.sin(time * 0.72 + index * 0.19),
        )
        if (!speaking) return 0.08 + noise * 0.05
        return Math.min(1, 0.12 + envelope * (0.22 + noise * 0.78))
      }, time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [active, count])

  return (
    <div className={cn("flex h-14 items-center gap-[3px]", className)} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          ref={(element) => {
            bars.current[index] = element
          }}
          className="h-full w-[3px] origin-center rounded-full bg-current"
          style={{ transform: "scaleY(0.16)" }}
        />
      ))}
    </div>
  )
}
