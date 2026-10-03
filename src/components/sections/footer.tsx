import { Link, useLocation } from "react-router-dom"
import { Wordmark } from "@/components/wordmark"
import { navLinks, site } from "@/config/site"

const year = new Date().getFullYear()

export function Footer() {
  const { pathname } = useLocation()
  const hrefFor = (hash: string) => (pathname === "/" ? hash : `/${hash}`)

  return (
    <footer className="border-t border-hairline bg-canvas pb-24 text-ink md:pb-12">
      <div className="shell grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <a href={hrefFor("#hero")} aria-label={site.brand}>
            <Wordmark />
          </a>
          <p className="mt-4 max-w-sm text-muted-ink">
            24/7 AI voice receptionists for dental and chiropractic clinics.
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={hrefFor(link.href)} className="text-muted-ink hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="footer"
                className="text-muted-ink hover:text-ink"
              >
                Book a Call
              </a>
            </li>
          </ul>
        </nav>

        <div className="space-y-2 text-sm md:col-span-4">
          <a href={`mailto:${site.contactEmail}`} className="block text-muted-ink hover:text-ink">
            {site.contactEmail}
          </a>
          <a
            href={site.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-muted-ink hover:text-ink"
          >
            LinkedIn
          </a>
          <p className="pt-2 text-muted-ink">Based in the UK · Working with clinics in the UK & US</p>
        </div>
      </div>

      <div className="shell space-y-3 border-t border-hairline py-6 text-sm text-muted-ink">
        <p>
          © {year} {site.brand}. {site.companyDetails} ·{" "}
          <Link to="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link to="/terms" className="underline underline-offset-4">
            Terms
          </Link>
        </p>
        <p>Demo audio and transcripts on this site are examples, not real patient calls.</p>
      </div>
    </footer>
  )
}
