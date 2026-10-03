import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { site } from "@/config/site"

export function MobileCta() {
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (pathname !== "/") return

    let heroVisible = true
    let finalVisible = false
    let heroEl: Element | null = null
    let finalEl: Element | null = null
    const update = () => setShow(!heroVisible && !finalVisible)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "hero") heroVisible = entry.isIntersecting
          if (entry.target.id === "book") finalVisible = entry.isIntersecting
        }
        update()
      },
      { threshold: 0.12 },
    )

    const attach = () => {
      const hero = document.getElementById("hero")
      const finalCta = document.getElementById("book")
      if (hero && hero !== heroEl) {
        if (heroEl) observer.unobserve(heroEl)
        heroEl = hero
        observer.observe(hero)
      }
      if (finalCta && finalCta !== finalEl) {
        if (finalEl) observer.unobserve(finalEl)
        finalEl = finalCta
        observer.observe(finalCta)
      }
    }

    attach()
    const root = document.getElementById("main")
    const mutations = new MutationObserver(attach)
    if (root) mutations.observe(root, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [pathname])

  if (pathname !== "/" || !show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <a
        href={site.calendlyLink}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="mobile"
        className="flex h-12 items-center justify-center rounded-full border border-hairline bg-white/75 text-sm font-medium text-ink shadow-[0_20px_60px_-20px_rgba(11,11,15,0.25)] backdrop-blur-xl"
      >
        Book a Free Call
        <span aria-hidden="true" className="ml-2 size-2 rounded-full bg-brand" />
      </a>
    </div>
  )
}
