import { site } from "@/config/site"

export function Privacy() {
  return (
    <article className="section-space bg-canvas">
      <div className="shell max-w-3xl pt-16">
        <p className="eyebrow text-brand-text">Privacy</p>
        <h1 className="mt-4 text-[clamp(2.4rem,5vw,4rem)] text-ink">Privacy Policy</h1>
        <div className="mt-8 space-y-4 text-muted-ink">
          <p>
            This is a placeholder page. {site.brand} will publish a full privacy policy before any clinic
            goes live.
          </p>
          <p>
            {site.brand} sets up AI voice receptionists for dental and chiropractic clinics. A finished
            policy will explain what call, appointment and message data is processed, who can access it,
            how long it is kept, and how a clinic can ask for it to be deleted.
          </p>
          <p>
            Nothing on this site is a certification, and this page is not legal advice. If you want to talk
            about how data would be handled for your clinic, email {site.contactEmail}.
          </p>
        </div>
      </div>
    </article>
  )
}
