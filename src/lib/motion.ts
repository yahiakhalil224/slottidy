import { useEffect, useState } from "react"

export const EASE = [0.22, 1, 0.36, 1] as const

export const revealTransition = {
  duration: 0.7,
  ease: EASE,
}

export const reducedReveal = {
  duration: 0.15,
  ease: "easeOut" as const,
}

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export const fadeOnly = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(media.matches)
    onChange()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return reduced
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [query])

  return matches
}

export function useInView<T extends Element>(rootMargin = "200px") {
  const [node, setNode] = useState<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, rootMargin])

  return [setNode, inView] as const
}
