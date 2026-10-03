import {
  Building2,
  Calendar,
  CalendarDays,
  Database,
  LayoutGrid,
  MessageSquare,
  NotebookPen,
  Phone,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useInView, useReducedMotion } from "@/lib/motion"

const tools: { name: string; icon: LucideIcon }[] = [
  { name: "Google Calendar", icon: Calendar },
  { name: "Outlook Calendar", icon: CalendarDays },
  { name: "Dentally", icon: LayoutGrid },
  { name: "Cliniko", icon: NotebookPen },
  { name: "Jane", icon: Users },
  { name: "Twilio", icon: Phone },
  { name: "SMS", icon: MessageSquare },
  { name: "Your CRM", icon: Database },
  { name: "Your practice management software", icon: Building2 },
]

export default function Integrations() {
  const reduced = useReducedMotion()
  const [setNode, inView] = useInView<HTMLElement>("100px")
  const loop = reduced ? tools : [...tools, ...tools]

  return (
    <section ref={setNode} aria-labelledby="integrations-title" className="bg-canvas py-16 sm:py-20">
      <div className="shell">
        <h2 id="integrations-title" className="text-center text-[clamp(1.6rem,3vw,2.2rem)] text-ink">
          Connects with tools like
        </h2>
      </div>

      {reduced ? (
        <ul className="shell mt-8 flex flex-wrap justify-center gap-3">
          {tools.map((tool) => (
            <Chip key={tool.name} name={tool.name} icon={tool.icon} />
          ))}
        </ul>
      ) : (
        <div
          className="marquee relative mt-8 overflow-hidden"
          data-paused={inView ? "false" : "true"}
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <ul className="marquee-track flex w-max gap-3 px-3">
            {loop.map((tool, index) => (
              <Chip key={`${tool.name}-${index}`} name={tool.name} icon={tool.icon} />
            ))}
          </ul>
        </div>
      )}

      <p className="shell mt-6 max-w-2xl text-center text-sm text-muted-ink sm:mx-auto">
        Exact integrations depend on your setup. We&apos;ll confirm what works for your clinic on the call.
      </p>
    </section>
  )
}

function Chip({ name, icon: Icon }: { name: string; icon: LucideIcon }) {
  return (
    <li className="flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-white/70 px-4 py-2.5 text-sm text-ink backdrop-blur-xl">
      <Icon strokeWidth={1.5} className="size-4 text-brand-text" aria-hidden="true" />
      {name}
    </li>
  )
}
