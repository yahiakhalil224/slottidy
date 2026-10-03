import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

const items = [
  {
    q: "Will patients know they're talking to AI?",
    a: "We recommend it introduces itself as your clinic's virtual assistant. Being upfront builds trust. It sounds natural and friendly, and patients can always ask for a person.",
  },
  {
    q: "What happens with calls the AI can't handle?",
    a: "You decide the rules. Urgent, sensitive or complex calls can be transferred to your team, or taken as a message with a callback flagged.",
  },
  {
    q: "Will it work with my booking system?",
    a: "It connects with many common calendars and practice tools. We'll check your exact setup on the call and tell you honestly what's possible.",
  },
  {
    q: "Does it replace my receptionist?",
    a: "No. It supports them. It covers after-hours calls, lunch breaks and the overflow when they're busy, so they can focus on patients in the clinic.",
  },
  {
    q: "How long does setup take?",
    a: "Most clinics are live within 2 weeks to 1 month, depending on your systems and scripts. After launch, we spend three months testing and fine-tuning.",
  },
  {
    q: "What about patient data and privacy?",
    a: "We take it seriously and set things up with data protection in mind. We'll walk you through exactly how data is handled for your clinic before anything goes live.",
  },
  {
    q: "What does it cost?",
    a: "It's tailored to your clinic, with a one-off setup and a monthly fee. Book a call and we'll give you a clear quote.",
  },
  {
    q: "Is there a long contract?",
    a: "We'll talk through options on the call. We want you to stay because it works, not because you're locked in.",
  },
]

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-space bg-canvas">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionHeading id="faq-title" title="Questions clinic owners ask us" />
        </Reveal>
        <Reveal className="lg:col-span-8" delay={0.06}>
          <Accordion type="single" collapsible className="gap-3">
            {items.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`faq-${index}`}
                className="rounded-[22px] border border-hairline bg-white/70 px-5 backdrop-blur-xl"
              >
                <AccordionTrigger className="py-4 text-base font-medium tracking-[-0.02em] text-ink hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-ink">
                  <p>{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
