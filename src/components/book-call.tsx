import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/magnetic"
import { site } from "@/config/site"
import { cn } from "@/lib/utils"

type Cta =
  | "nav"
  | "hero"
  | "services"
  | "calculator"
  | "pricing"
  | "final"
  | "mobile"
  | "footer"
  | "menu"

export function BookCall({
  cta,
  children,
  tone = "ink",
  className,
}: {
  cta: Cta
  children: ReactNode
  tone?: "ink" | "light"
  className?: string
}) {
  return (
    <Magnetic>
      <Button
        asChild
        className={cn(
          "h-12 rounded-full px-6 text-[15px] font-medium tracking-[-0.01em]",
          "bg-brand text-ink hover:bg-brand/85",
          tone === "ink"
            ? "shadow-[0_10px_30px_-12px_rgba(11,11,12,0.35)]"
            : "shadow-[0_0_40px_-8px_rgba(198,244,50,0.55)]",
          className,
        )}
      >
        <a href={site.calendlyLink} target="_blank" rel="noopener noreferrer" data-cta={cta}>
          {children}
          <span
            aria-hidden="true"
            className="ml-1 size-2 rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:scale-150"
          />
        </a>
      </Button>
    </Magnetic>
  )
}
