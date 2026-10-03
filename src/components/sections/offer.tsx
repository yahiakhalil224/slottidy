import {
  Bell,
  CalendarCheck,
  Clock,
  MessageCircleQuestion,
  Phone,
  UserRoundCheck,
} from "lucide-react"
import { BookCall } from "@/components/book-call"
import { GlassCard } from "@/components/glass-card"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

const features = [
  {
    icon: Phone,
    title: "Every call answered, 24/7",
    body: "Lunch breaks, evenings, weekends, bank holidays and busy Monday mornings. Patients always reach someone.",
    className: "md:col-span-7",
  },
  {
    icon: CalendarCheck,
    title: "Appointments booked for you",
    body: "It books, reschedules and confirms appointments directly in your calendar, so they're there when you open in the morning.",
    className: "md:col-span-5",
  },
  {
    icon: MessageCircleQuestion,
    title: "Patient questions handled",
    body: "Prices, opening hours, insurance, parking and location, answered your way in a friendly voice.",
    className: "md:col-span-4",
  },
  {
    icon: UserRoundCheck,
    title: "New patients qualified",
    body: "It asks the right questions and passes urgent or complex calls to your team.",
    className: "md:col-span-4",
  },
  {
    icon: Bell,
    title: "Fewer no-shows",
    body: "Automatic SMS confirmations and reminders help patients actually turn up.",
    className: "md:col-span-4",
  },
  {
    icon: Clock,
    title: "Your team gets time back",
    body: "Reception can focus on the patients in the room instead of the phone.",
    className: "md:col-span-12",
  },
]

const chips = [
  "Custom call scripts in your clinic's voice",
  "Calendar, CRM and SMS integration",
  "3 months of testing and optimisation",
  "Ongoing monitoring and monthly reports",
]

export default function Offer() {
  return (
    <section id="offer" aria-labelledby="offer-title" className="section-space bg-canvas">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="The 24/7 AI voice system"
            id="offer-title"
            title="A receptionist that never sleeps, takes breaks or puts anyone on hold."
          />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-12">
          {features.map((feature) => (
            <RevealItem key={feature.title} className={feature.className}>
              <GlassCard className="h-full p-6 sm:p-7">
                <feature.icon strokeWidth={1.5} className="size-5 text-brand-text" aria-hidden="true" />
                <h3 className="mt-5 text-[1.35rem] tracking-[-0.03em] text-ink">{feature.title}</h3>
                <p className="mt-3 max-w-xl text-muted-ink">{feature.body}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal>
          <ul className="mt-6 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-hairline bg-white/70 px-4 py-2 text-sm text-ink backdrop-blur-xl"
              >
                {chip}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <BookCall cta="services">Book a Call</BookCall>
          <p className="text-sm text-muted-ink">15–30 minutes, no pressure.</p>
        </Reveal>
      </div>
    </section>
  )
}
