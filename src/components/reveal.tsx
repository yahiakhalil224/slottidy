import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { EASE, useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={
        reduced
          ? { duration: 0.15, delay: Math.min(delay, 0.05) }
          : { duration: 0.7, ease: EASE, delay }
      }
    >
      {children}
    </motion.div>
  )
}

export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduced ? 0.02 : 0.08 },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={
        reduced
          ? {
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 0.15 } },
            }
          : {
              hidden: { opacity: 0, y: 40 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: EASE },
              },
            }
      }
    >
      {children}
    </motion.div>
  )
}
