const brand = "Slotidy"

export const site = {
  brand,
  calendlyLink: "[CALENDLY_LINK]",
  demoAudioUrl: "[DEMO_AUDIO_URL]",
  contactEmail: "[CONTACT_EMAIL]",
  founderPhoto: "[FOUNDER_PHOTO]",
  linkedinUrl: "[LINKEDIN_URL]",
  companyDetails: "[COMPANY_DETAILS]",
  canonical: "[CANONICAL_URL]",
  description: `${brand} sets up done-for-you AI voice receptionists that answer every call 24/7, book appointments into your calendar and send SMS reminders. Built for dental and chiropractic clinics in the UK & US.`,
  founder: "Yahya Khalil",
  founderInitials: "YK",
} as const

export const siteTitle = `${site.brand} | 24/7 AI Receptionist for Dental & Chiropractic Clinics`

export const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#demo", label: "Demo" },
  { href: "#calculator", label: "Calculator" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
] as const

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    name: site.brand,
    description: site.description,
    url: site.canonical,
    email: site.contactEmail,
    founder: {
      "@type": "Person",
      name: site.founder,
    },
    areaServed: ["GB", "US"],
  }
}
