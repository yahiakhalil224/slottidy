import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: false,
      anchors: { offset: -88 },
      stopInertiaOnNavigate: true,
    })

    lenis.on("scroll", ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const onRefresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", onRefresh)

    return () => {
      window.removeEventListener("load", onRefresh)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      ScrollTrigger.refresh()
    }
  }, [reduced])

  return children
}
