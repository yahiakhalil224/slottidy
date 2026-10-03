import { site } from "@/config/site"

export function Terms() {
  return (
    <article className="section-space bg-canvas">
      <div className="shell max-w-3xl pt-16">
        <p className="eyebrow text-brand-text">Terms</p>
        <h1 className="mt-4 text-[clamp(2.4rem,5vw,4rem)] text-ink">Terms</h1>
        <div className="mt-8 space-y-4 text-muted-ink">
          <p>
            This is a placeholder page. {site.brand} will share clear terms before any work starts.
          </p>
          <p>
            Each clinic is different. Scope, setup and monthly fees are agreed on the call and confirmed in
            writing. The calculator on this site is a rough estimate, not a promise of results.
          </p>
          <p>
            Questions about these terms can go to {site.contactEmail}.
          </p>
        </div>
      </div>
    </article>
  )
}
