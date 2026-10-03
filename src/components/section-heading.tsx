import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  id,
  intro,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow?: string
  title: string
  id: string
  intro?: string
  tone?: "light" | "dark"
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow mb-4", tone === "dark" ? "text-brand" : "text-brand-text")}>
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className={cn("text-balance", tone === "dark" ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-pretty",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-white/72" : "text-muted-ink",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  )
}
