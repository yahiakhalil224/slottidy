import { useEffect } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { LucideProvider } from "lucide-react"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Footer } from "@/components/sections/footer"
import { MobileCta } from "@/components/sections/mobile-cta"
import { Nav } from "@/components/sections/nav"
import { site, siteTitle } from "@/config/site"
import { Home } from "@/pages/home"
import { Privacy } from "@/pages/privacy"
import { Terms } from "@/pages/terms"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function DocumentTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname === "/privacy") document.title = `${site.brand} | Privacy Policy`
    else if (pathname === "/terms") document.title = `${site.brand} | Terms`
    else document.title = siteTitle
  }, [pathname])
  return null
}

export default function App() {
  return (
    <LucideProvider strokeWidth={1.5}>
      <SmoothScroll>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30 opacity-[0.18] mix-blend-overlay"
          style={{ backgroundImage: "url(/grain.svg)", backgroundSize: "180px 180px" }}
        />
        <BrowserRouter>
          <ScrollToTop />
          <DocumentTitle />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
          <MobileCta />
        </BrowserRouter>
      </SmoothScroll>
    </LucideProvider>
  )
}
