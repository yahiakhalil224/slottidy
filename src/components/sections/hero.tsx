import { useEffect, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import { Play } from "lucide-react"
import { BookCall } from "@/components/book-call"
import { SpeechWave } from "@/components/speech-wave"
import { Button } from "@/components/ui/button"
import { site } from "@/config/site"
import { EASE, useInView, useReducedMotion } from "@/lib/motion"

const headline = ["Never", "miss", "another", "patient", "call."]
const accent = ["Day", "or", "night."]

const captions = [
  {
    who: "Assistant",
    text: "Good evening, you've reached Smile Dental. I'm the clinic's virtual assistant, how can I help?",
  },
  { who: "Caller", text: "I'd like to book a check-up" },
  { who: "Assistant", text: "I have Tuesday at 10:30 or Thursday at 4. Which suits you?" },
]

export function Hero() {
  const reduced = useReducedMotion()
  const [setOrb, orbInView] = useInView<HTMLDivElement>("0px")
  const [caption, setCaption] = useState(0)
  const [breathing, setBreathing] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 50, damping: 18 })
  const springY = useSpring(y, { stiffness: 50, damping: 18 })

  useEffect(() => {
    if (reduced || !orbInView) return
    const id = window.setInterval(() => {
      setCaption((current) => (current + 1) % captions.length)
    }, 3800)
    return () => window.clearInterval(id)
  }, [orbInView, reduced])

  function onPointerMove(event: React.MouseEvent<HTMLElement>) {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    x.set(px * 18)
    y.set(py * 14)
  }

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-ink text-white"
      onMouseMove={onPointerMove}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <Drift className="pointer-events-none absolute -top-24 -left-16 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,209,160,0.2),transparent_68%)] blur-2xl" from={30} to={-70} />
      <Drift className="pointer-events-none absolute right-[-8%] bottom-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.18),transparent_68%)] blur-2xl" from={16} to={-48} />

      <div className="shell relative grid items-center gap-6 pt-[4.75rem] pb-8 sm:pt-28 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-8 lg:pt-28 lg:pb-16">
        <div className="relative z-10 lg:col-span-7">
          <motion.p
            className="eyebrow text-brand"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0.15 } : { duration: 0.5, delay: 0.12, ease: EASE }}
          >
            AI receptionist for dental & chiropractic clinics
          </motion.p>

          {/*
            Headline options kept for reference, not rendered:
            B "Your front desk, answering 24/7."
            C "Every missed call is a patient booking somewhere else."
          */}
          <h1 id="hero-title" className="mt-3 text-white sm:mt-4">
            <span className="block">
              {headline.map((word, index) => (
                <Word key={word} index={index} reduced={reduced}>
                  {word}
                </Word>
              ))}
            </span>
            <span className="relative mt-1 inline-block text-brand">
              {accent.map((word, index) => (
                <Word key={word} index={headline.length + index} reduced={reduced}>
                  {word}
                </Word>
              ))}
              <motion.span
                aria-hidden="true"
                className="absolute right-0 -bottom-1 left-0 h-[3px] origin-left rounded-full bg-brand"
                initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={reduced ? { duration: 0.15 } : { duration: 0.45, delay: 0.95, ease: EASE }}
              />
            </span>
          </h1>

          <motion.p
            className="mt-3 max-w-xl text-base leading-[1.45] text-white/75 sm:mt-5 sm:text-[1.0625rem] sm:leading-[1.6]"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0.15 } : { duration: 0.55, delay: 0.82, ease: EASE }}
          >
            {site.brand} sets up a done-for-you AI voice receptionist that answers every call to your
            clinic, at lunch, after hours, at weekends and when reception is busy. It books appointments
            straight into your calendar, answers patient questions and sends SMS reminders, so fewer
            patients slip through the cracks.
          </motion.p>

          <motion.div
            className="mt-4 flex flex-wrap items-center gap-3 sm:mt-6"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0.15 } : { duration: 0.55, delay: 0.92, ease: EASE }}
          >
            <BookCall cta="hero" tone="light" className="h-11 sm:h-12">
              Book a Free Call
            </BookCall>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-white/20 bg-white/10 px-5 text-white backdrop-blur-xl hover:bg-white/16 hover:text-white sm:h-12"
            >
              <a href="#demo">
                Hear it in action
                <Play className="size-3.5 fill-current" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </Button>
          </motion.div>

          <motion.p
            className="mt-4 font-mono text-[12px] tracking-wide text-white/55"
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0.15 : 0.5, delay: reduced ? 0 : 1.05 }}
          >
            Done for you · Works alongside your team · Built and tested around your clinic
          </motion.p>
        </div>

        <div ref={setOrb} className="relative z-10 lg:col-span-5">
          <motion.div
            style={reduced ? undefined : { x: springX, y: springY }}
            className="relative mx-auto h-[240px] w-full max-w-[460px] sm:h-[300px] lg:h-[460px]"
          >
            <motion.div
              className="absolute inset-[8%] rounded-full"
              initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduced ? { duration: 0.15 } : { duration: 1.15, ease: EASE }}
              onAnimationComplete={() => setBreathing(true)}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.85),rgba(0,209,160,0.75)_28%,rgba(0,168,132,0.35)_52%,rgba(124,92,255,0.45)_78%,transparent_80%)] blur-2xl"
                style={breathing && !reduced ? { animation: "breathe 5.5s ease-in-out infinite" } : undefined}
              />
              <div
                aria-hidden="true"
                className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_32%_28%,#f4fffb,rgba(0,209,160,0.95)_36%,rgba(11,11,15,0.2)_70%,rgba(124,92,255,0.55))] shadow-[0_30px_80px_-20px_rgba(0,209,160,0.45)]"
                style={breathing && !reduced ? { animation: "breathe 5.5s ease-in-out infinite" } : undefined}
              />
              {!reduced ? (
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff,rgba(0,209,160,0.8))] blur-xl"
                  initial={{ opacity: 0.85 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1.15, ease: EASE }}
                />
              ) : null}
            </motion.div>

            <Drift className="absolute top-2 left-0 hidden rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur-xl sm:inline-flex" from={18} to={-28}>
              After hours
            </Drift>
            <Drift className="absolute top-8 right-0 hidden rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur-xl md:inline-flex" from={28} to={-46}>
              Books the visit
            </Drift>
            <Drift className="absolute bottom-40 left-2 hidden rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur-xl lg:inline-flex" from={10} to={-22}>
              Sends a reminder
            </Drift>
            <div className="absolute inset-x-6 bottom-2 rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl sm:inset-x-4 sm:bottom-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white">
                  <span
                    className="size-1.5 rounded-full bg-brand"
                    style={reduced ? undefined : { animation: "live-dot 1.6s ease-in-out infinite" }}
                  />
                  Live · 11:47 PM
                </span>
                <span className="font-mono text-[11px] text-white/60">{captions[caption]?.who}</span>
              </div>
              <div className="text-brand">
                <SpeechWave count={42} active={orbInView && !reduced} />
              </div>
              <div className="mt-3 min-h-[4.5rem]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={reduced ? "static" : caption}
                    className="text-sm leading-snug text-white/90"
                    initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                    transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE }}
                  >
                    {captions[reduced ? 0 : caption]?.text}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Drift({
  children,
  className,
  from,
  to,
}: {
  children?: React.ReactNode
  className?: string
  from: number
  to: number
}) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.35], [from, to])
  return (
    <motion.div aria-hidden="true" style={reduced ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  )
}

function Word({
  children,
  index,
  reduced,
}: {
  children: string
  index: number
  reduced: boolean
}) {
  return (
    <>
      <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom leading-[1.02]">
        {reduced ? (
          <span className="inline-block">{children}</span>
        ) : (
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.62, delay: 0.22 + index * 0.06, ease: EASE }}
          >
            {children}
          </motion.span>
        )}
      </span>{" "}
    </>
  )
}
