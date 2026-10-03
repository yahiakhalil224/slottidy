import { Clock3, PhoneMissed, UserRoundX } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

const cards = [
  {
    icon: Clock3,
    title: "Calls at lunch and after hours",
    body: "Lots of people call when they're free, which is often when you're closed.",
  },
  {
    icon: PhoneMissed,
    title: "Reception is stretched",
    body: "Checking patients in, taking payments and answering the phone, all at once.",
  },
  {
    icon: UserRoundX,
    title: "No-shows and last-minute gaps",
    body: "Forgotten appointments leave empty chairs you can't fill in time.",
  },
]

export default function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="section-space bg-canvas">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Sound familiar?"
            id="problem-title"
            title="The phone rings. Nobody picks up. That patient books elsewhere."
            intro="Most people won't leave a voicemail. If they can't get through, they just call the next clinic on Google. It's not your team's fault. They're busy looking after the patients in front of them."
          />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <RevealItem key={card.title}>
              <GlassCard className="h-full p-6">
                <card.icon strokeWidth={1.5} className="size-5 text-brand-text" aria-hidden="true" />
                <h3 className="mt-5 text-xl tracking-[-0.03em] text-ink">{card.title}</h3>
                <p className="mt-3 text-muted-ink">{card.body}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <p className="mx-auto mt-16 max-w-3xl text-center font-heading text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-ink">
            Every unanswered call could be a new patient. Let&apos;s catch them.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
