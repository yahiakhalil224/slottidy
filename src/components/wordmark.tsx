import { site } from "@/config/site"
import { cn } from "@/lib/utils"

export function Wordmark({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.4em] font-heading text-[1.2rem] leading-none font-semibold tracking-[-0.03em]",
        tone === "light" ? "text-white" : "text-ink",
        className,
      )}
    >
      {site.brand}
      <span className="inline-flex h-4 items-end gap-[2px]" aria-hidden="true">
        {[0.5, 0.85, 1, 0.62].map((height, index) => (
          <span
            key={height}
            className="wave-bar w-[2.5px] rounded-full bg-brand"
            style={{
              height: `${height * 16}px`,
              animationDelay: `${index * 0.12}s`,
            }}
          />
        ))}
      </span>
    </span>
  )
}
