import { useEffect, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function Magnetic({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 })

  useEffect(() => {
    if (reduced) {
      x.set(0)
      y.set(0)
      return
    }
    if (!window.matchMedia("(pointer: fine)").matches) return

    const onMove = (event: PointerEvent) => {
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const distance = Math.hypot(dx, dy)
      if (distance > 80) {
        x.set(0)
        y.set(0)
        return
      }
      const strength = (1 - distance / 80) * 10
      const angle = Math.atan2(dy, dx)
      x.set(Math.cos(angle) * strength)
      y.set(Math.sin(angle) * strength)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [reduced, x, y])

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} className={cn("inline-flex", className)}>
      {children}
    </motion.div>
  )
}
