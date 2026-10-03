import { lazy, Suspense, useEffect } from "react"
import { Hero } from "@/components/sections/hero"

const Problem = lazy(() => import("@/components/sections/problem"))
const Offer = lazy(() => import("@/components/sections/offer"))
const Demo = lazy(() => import("@/components/sections/demo"))
const HowItWorks = lazy(() => import("@/components/sections/how-it-works"))
const Calculator = lazy(() => import("@/components/sections/calculator"))
const Integrations = lazy(() => import("@/components/sections/integrations"))
const About = lazy(() => import("@/components/sections/about"))
const Pricing = lazy(() => import("@/components/sections/pricing"))
const Faq = lazy(() => import("@/components/sections/faq"))
const FinalCta = lazy(() => import("@/components/sections/final-cta"))

export function Home() {
  useEffect(() => {
    const warmup = () => {
      void import("@/components/sections/problem")
      void import("@/components/sections/offer")
      void import("@/components/sections/demo")
      void import("@/components/sections/how-it-works")
      void import("@/components/sections/calculator")
      void import("@/components/sections/integrations")
      void import("@/components/sections/about")
      void import("@/components/sections/pricing")
      void import("@/components/sections/faq")
      void import("@/components/sections/final-cta")
    }
    const id = window.setTimeout(warmup, 300)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <>
      <Hero />
      <Suspense fallback={<div className="min-h-[40vh] bg-canvas" aria-hidden="true" />}>
        <Problem />
      </Suspense>
      <Suspense fallback={<div className="min-h-[40vh] bg-canvas" aria-hidden="true" />}>
        <Offer />
      </Suspense>
      <Suspense fallback={<div className="min-h-[50vh] bg-canvas" aria-hidden="true" />}>
        <Demo />
      </Suspense>
      <Suspense fallback={<div className="min-h-[70vh] bg-ink" aria-hidden="true" />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<div className="min-h-[40vh] bg-canvas" aria-hidden="true" />}>
        <Calculator />
      </Suspense>
      <Suspense fallback={<div className="min-h-40 bg-canvas" aria-hidden="true" />}>
        <Integrations />
      </Suspense>
      <Suspense fallback={<div className="min-h-[40vh] bg-canvas" aria-hidden="true" />}>
        <About />
      </Suspense>
      <Suspense fallback={<div className="min-h-40 bg-canvas" aria-hidden="true" />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<div className="min-h-[40vh] bg-canvas" aria-hidden="true" />}>
        <Faq />
      </Suspense>
      <Suspense fallback={<div className="min-h-[40vh] bg-ink" aria-hidden="true" />}>
        <FinalCta />
      </Suspense>
    </>
  )
}
