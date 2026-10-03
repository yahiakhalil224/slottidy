import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { BookCall } from "@/components/book-call"
import { useReducedMotion } from "@/lib/motion"

export default function FinalCta() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -60])
  const y2 = useTransform(scrollYProgress, [0, 1], [20, -30])

  return (
    <section
      ref={ref}
      id="book"
      aria-labelledby="final-title"
      className="relative overflow-hidden bg-ink py-24 text-white sm:py-32"
    >
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: y1 }}
        className="pointer-events-none absolute -top-10 left-[10%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(0,209,160,0.22),transparent_68%)] blur-2xl"
      />
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: y2 }}
        className="pointer-events-none absolute right-[-6%] bottom-[-20%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.2),transparent_68%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,209,160,0.35),transparent_70%)] blur-3xl"
      />

      <div className="shell relative text-center">
        <h2 id="final-title" className="mx-auto max-w-4xl text-balance text-white">
          Your phone&apos;s going to ring tonight. Who&apos;s answering?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-white/72">
          Book a free call. We&apos;ll look at how your clinic handles calls today and show you, honestly,
          whether an AI receptionist makes sense for you.
        </p>
        <div className="mt-8 flex justify-center">
          <BookCall cta="final" tone="light" className="h-14 px-8 text-base">
            Book Your Free Call
          </BookCall>
        </div>
        <p className="mt-4 text-sm text-white/55">No pressure. No hard sell.</p>
      </div>
    </section>
  )
}
