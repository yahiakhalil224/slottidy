import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { useLocation } from "react-router-dom"
import { BookCall } from "@/components/book-call"
import { Wordmark } from "@/components/wordmark"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { navLinks, site } from "@/config/site"
import { EASE, useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function hrefFor(pathname: string, hash: string) {
  return pathname === "/" ? hash : `/${hash}`
}

export function Nav() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [overHero, setOverHero] = useState(pathname === "/")

  useEffect(() => {
    const hero = document.getElementById("hero")
    if (!hero || pathname !== "/") return
    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry?.isIntersecting ?? false),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0.05 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname])

  const light = pathname === "/" && overHero

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0.15 } : { duration: 0.55, ease: EASE }}
    >
      <div
        className={cn(
          "mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between gap-3 px-3 transition-[background,box-shadow,border-color] duration-300 sm:px-4",
          light
            ? "border border-transparent bg-transparent"
            : "rounded-full border border-hairline bg-white/70 shadow-[0_20px_60px_-20px_rgba(11,11,15,0.15)] backdrop-blur-xl",
        )}
      >
        <a href={hrefFor(pathname, "#hero")} className="shrink-0 rounded-full" aria-label={site.brand}>
          <Wordmark tone={light ? "light" : "dark"} />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={hrefFor(pathname, link.href)}
              className={cn(
                "text-sm tracking-[-0.01em] transition-opacity hover:opacity-100",
                light ? "text-white/75 hover:text-white" : "text-muted-ink hover:text-ink",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <BookCall cta="nav" tone={light ? "light" : "ink"} className="h-10 px-4">
              Book a Call
            </BookCall>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-11 rounded-full lg:hidden",
                  light ? "text-white hover:bg-white/10" : "text-ink hover:bg-black/5",
                )}
                aria-label="Open menu"
              >
                <Menu strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="!inset-0 !h-full !w-full !max-w-none border-0 bg-white/75 backdrop-blur-2xl"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Pages and sections for {site.brand}
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-1 flex-col justify-center gap-2 px-6" aria-label="Mobile">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={hrefFor(pathname, link.href)}
                      className="font-heading text-4xl tracking-[-0.03em] text-ink"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <div className="mt-8">
                  <BookCall cta="menu" className="h-14 px-7 text-base">
                    Book a Call
                  </BookCall>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
