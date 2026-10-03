import { BookCall } from "@/components/book-call"
import { GlassCard } from "@/components/glass-card"
import { Reveal } from "@/components/reveal"

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="bg-canvas pb-6">
      <div className="shell">
        <Reveal>
          <GlassCard lift={false} className="mx-auto max-w-3xl p-6 sm:p-8">
            <h2 id="pricing-title" className="sr-only">
              Pricing guide
            </h2>
            <p className="text-pretty text-ink">
              Every clinic is different, so we tailor each setup. As a guide, projects start from £1,500
              setup and from £500/month for ongoing running, monitoring and optimisation. We&apos;ll give
              you a clear quote on the call, with no surprises.
            </p>
            <div className="mt-6">
              <BookCall cta="pricing">Get your quote</BookCall>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}
