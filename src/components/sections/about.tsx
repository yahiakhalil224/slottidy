import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { site } from "@/config/site"
import { useReducedMotion } from "@/lib/motion"

const points = [
  {
    title: "Honest by default",
    body: "We'll tell you what AI can and can't do for your clinic, even if that means it's not a fit.",
  },
  {
    title: "Built around your clinic",
    body: "Custom scripts, your tone, your rules. Nothing off-the-shelf.",
  },
  {
    title: "We stay with you",
    body: "Three months of testing and optimisation, then ongoing monitoring and reporting.",
  },
]

export default function About() {
  const reduced = useReducedMotion()
  const frame = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [28, -28])

  return (
    <section id="about" aria-labelledby="about-title" className="section-space bg-canvas">
      <div className="shell grid items-center gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div ref={frame} className="rounded-[28px] border border-hairline bg-white/40 p-3 backdrop-blur-xl">
            <motion.div style={reduced ? undefined : { y }} className="overflow-hidden rounded-[22px]">
              <FounderPortrait />
            </motion.div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading eyebrow="About" id="about-title" title="Hi, I'm Yahya." />
            <div className="mt-6 space-y-4 text-muted-ink">
              <p>
                I&apos;m {site.founder}, the founder of {site.brand}, based in the UK. I started {site.brand}{" "}
                because I kept seeing the same simple problem. Great clinics were losing patients just
                because nobody could get to the phone in time.
              </p>
              <p>
                I build AI voice systems, and I&apos;ll be straight with you. AI isn&apos;t magic, and it
                won&apos;t replace your team. What it can do really well is answer the phone every single
                time, handle routine bookings and questions, and pass anything tricky to your people.
              </p>
              <p>
                We&apos;re a new, focused agency, so you won&apos;t find a wall of logos here. What you get
                instead is me, personally setting up, testing and improving your system for the first three
                months, plus monthly reports so you can see exactly what it&apos;s doing.
              </p>
            </div>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point.title}>
                <Reveal>
                  <p className="font-heading text-lg tracking-[-0.03em] text-ink">{point.title}</p>
                  <p className="mt-1 text-muted-ink">{point.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-8">
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-hairline bg-white/70 px-5 py-3 text-sm text-ink backdrop-blur-xl"
            >
              Connect on LinkedIn
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function FounderPortrait() {
  const placeholder = site.founderPhoto.startsWith("[") || site.founderPhoto.length === 0
  const [failed, setFailed] = useState(false)

  if (placeholder || failed) {
    return (
      <div
        role="img"
        aria-label={`${site.founder}, founder of ${site.brand}`}
        className="flex aspect-[4/5] items-end bg-[radial-gradient(circle_at_30%_18%,rgba(0,209,160,0.55),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(124,92,255,0.32),transparent_46%),linear-gradient(165deg,#16382f,#0B0B0F)] p-6"
      >
        <span className="font-heading text-6xl tracking-[-0.04em] text-white">{site.founderInitials}</span>
      </div>
    )
  }

  return (
    <img
      src={site.founderPhoto}
      alt={`${site.founder}, founder of ${site.brand}`}
      width={800}
      height={1000}
      className="aspect-[4/5] h-auto w-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}
