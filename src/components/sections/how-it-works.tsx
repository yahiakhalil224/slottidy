import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PhoneFrame, PhoneScreen } from "@/components/phone-mockup"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { useInView, useMediaQuery, useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    title: "Call comes in",
    body: "It's 7:42 pm on a Tuesday. Your clinic is closed.",
  },
  {
    title: "AI answers instantly",
    body: "Your AI receptionist picks up on the first ring, friendly and on-script.",
  },
  {
    title: "Appointment booked",
    body: "It checks your calendar and books a slot that suits the patient.",
  },
  {
    title: "SMS confirmation sent",
    body: "The patient gets a text confirmation and a reminder before the visit.",
  },
  {
    title: "Patient shows up",
    body: "They turn up on time, and your team never had to touch the phone.",
  },
]

const after = [
  "Discovery call",
  "Custom setup and scripts",
  "Testing and launch",
  "3 months of optimisation",
  "Monthly reporting",
]

export default function HowItWorks() {
  const reduced = useReducedMotion()
  const desktop = useMediaQuery("(min-width: 1024px)")
  const pin = desktop && !reduced
  const rootRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!pin) return
    const root = rootRef.current
    if (!root) return

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (railRef.current) {
            railRef.current.style.transform = `scaleY(${self.progress})`
          }
          const next = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
          setActive((current) => (current === next ? current : next))
        },
      })
    }, root)

    return () => context.revert()
  }, [pin])

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="bg-ink text-white">
      {pin ? (
        <div ref={rootRef} className="flex h-svh items-center overflow-hidden">
          <div className="shell grid w-full items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="How it works"
                id="how-title"
                tone="dark"
                title="From ring to appointment, without lifting a finger."
              />
              <ol className="relative mt-8 space-y-2 pl-6">
                <div className="absolute top-1 bottom-1 left-0 w-px bg-white/15" aria-hidden="true">
                  <div ref={railRef} className="h-full w-px origin-top bg-brand" style={{ transform: "scaleY(0)" }} />
                </div>
                {steps.map((step, index) => (
                  <li key={step.title} aria-current={active === index ? "step" : undefined} className="py-1.5">
                    <p className="font-mono text-[12px] text-brand">0{index + 1}</p>
                    <h3
                      className={cn(
                        "mt-1 text-xl tracking-[-0.03em] transition-opacity",
                        active === index ? "text-white" : "text-white/40",
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "max-w-md text-sm text-white/70 transition-opacity",
                        active === index ? "opacity-100" : "opacity-0 h-0 overflow-hidden",
                      )}
                    >
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-6">
              <PhoneFrame>
                <PhoneScreen step={active} active />
              </PhoneFrame>
            </div>
          </div>
        </div>
      ) : (
        <div className="section-space">
          <div className="shell">
            <SectionHeading
              eyebrow="How it works"
              id="how-title"
              tone="dark"
              title="From ring to appointment, without lifting a finger."
            />
            <ol className="mt-12 space-y-14">
              {steps.map((step, index) => (
                <StepBlock key={step.title} index={index} title={step.title} body={step.body} />
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 bg-canvas text-ink">
        <div className="shell section-space">
          <Reveal>
            <ol aria-label="What happens after you book a call" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {after.map((item, index) => (
                <li key={item} className="rounded-[24px] border border-hairline bg-white/70 p-5 backdrop-blur-xl">
                  <p className="font-mono text-[12px] text-brand-text">0{index + 1}</p>
                  <p className="mt-3 font-heading text-lg tracking-[-0.03em]">{item}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function StepBlock({
  index,
  title,
  body,
}: {
  index: number
  title: string
  body: string
}) {
  const [setNode, inView] = useInView<HTMLLIElement>("-20% 0px")
  return (
    <li ref={setNode} className="grid items-center gap-6 md:grid-cols-2">
      <PhoneFrame>
        <PhoneScreen step={index} active={inView} />
      </PhoneFrame>
      <div>
        <p className="font-mono text-[12px] text-brand">0{index + 1}</p>
        <h3 className="mt-2 text-2xl tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 max-w-md text-white/72">{body}</p>
      </div>
    </li>
  )
}
