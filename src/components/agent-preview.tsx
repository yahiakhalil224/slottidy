import { useEffect, useRef, useState, type FormEvent } from "react"
import { Square, Volume2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Magnetic } from "@/components/magnetic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EASE, useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Speaker = "ai" | "caller"
type Line = { speaker: Speaker; text: string }

const businessTypes = [
  { value: "dental", label: "Dental clinic" },
  { value: "chiro", label: "Chiropractic clinic" },
  { value: "physio", label: "Physiotherapy clinic" },
  { value: "aesthetics", label: "Aesthetics / med spa" },
  { value: "vet", label: "Veterinary practice" },
  { value: "other", label: "Other business" },
] as const

type BusinessType = (typeof businessTypes)[number]["value"]

function scriptFor(name: string, type: BusinessType): Line[] {
  const business = name.trim() || "your business"
  const greeting: Line = {
    speaker: "ai",
    text: `Hi, thanks for calling ${business}. I'm the virtual receptionist. How can I help today?`,
  }
  const close: Line = {
    speaker: "ai",
    text: "Perfect, you're all booked in. I'll text you a confirmation now, plus a reminder the day before. Is there anything else I can help with?",
  }

  switch (type) {
    case "dental":
      return [
        greeting,
        { speaker: "caller", text: "Hi, I've chipped a tooth. Do you have anything this week?" },
        { speaker: "ai", text: "Sorry to hear that. I can offer Wednesday at 9:15 am or Thursday at 2:40 pm. Which suits you better?" },
        { speaker: "caller", text: "Thursday, please." },
        close,
      ]
    case "chiro":
      return [
        greeting,
        { speaker: "caller", text: "Hi, my lower back's been sore for a week. Can I come in for an assessment?" },
        { speaker: "ai", text: "Of course. As a new patient, you'd start with a forty-five minute initial assessment. I have tomorrow at 10 am or Friday at 4:30 pm. Which works for you?" },
        { speaker: "caller", text: "Friday afternoon is great." },
        close,
      ]
    case "physio":
      return [
        greeting,
        { speaker: "caller", text: "Hi, I twisted my knee playing football. Can someone take a look?" },
        { speaker: "ai", text: "I'm sorry to hear that. I can book you an initial physio assessment on Tuesday at 8:30 am or Wednesday at 5 pm. Which would you prefer?" },
        { speaker: "caller", text: "Tuesday morning, please." },
        close,
      ]
    case "aesthetics":
      return [
        greeting,
        { speaker: "caller", text: "Hi, I'd like to book a consultation for skin treatments." },
        { speaker: "ai", text: "Lovely. Consultations are free and take about thirty minutes. I have Saturday at 11 am or Monday at 6 pm. Which suits you?" },
        { speaker: "caller", text: "Saturday at eleven." },
        close,
      ]
    case "vet":
      return [
        greeting,
        { speaker: "caller", text: "Hi, my dog's due for his vaccinations. Can I book him in?" },
        { speaker: "ai", text: "Of course. I can see Thursday at 3:15 pm or Saturday at 9 am with one of our vets. Which is easier for you?" },
        { speaker: "caller", text: "Saturday morning works." },
        close,
      ]
    default:
      return [
        greeting,
        { speaker: "caller", text: "Hi, I'd like to book an appointment, please." },
        { speaker: "ai", text: "Happy to help. I have tomorrow at 10:30 am or Thursday at 2 pm. Which works better for you?" },
        { speaker: "caller", text: "Thursday at two is perfect." },
        close,
      ]
  }
}

function pickVoices() {
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"))
  const rank = (voice: SpeechSynthesisVoice, preferred: string[]) => {
    const index = preferred.findIndex((name) => voice.name.toLowerCase().includes(name))
    const quality = /natural|neural|premium|enhanced|online/i.test(voice.name) ? 0 : 10
    return (index === -1 ? 50 : index) + quality + (voice.lang === "en-GB" ? 0 : 1)
  }
  const sorted = (preferred: string[]) => [...voices].sort((a, b) => rank(a, preferred) - rank(b, preferred))
  const agent = sorted(["sonia", "libby", "google uk english female", "serena", "kate", "samantha", "female", "aria", "jenny"])[0]
  const caller =
    sorted(["ryan", "google uk english male", "daniel", "arthur", "male", "guy", "alex"]).find((voice) => voice !== agent) ?? agent
  return { agent, caller }
}

const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window

export function AgentPreview() {
  const reduced = useReducedMotion()
  const [name, setName] = useState("")
  const [type, setType] = useState<BusinessType>("dental")
  const [lines, setLines] = useState<Line[]>([])
  const [active, setActive] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const run = useRef(0)

  useEffect(() => {
    if (!speechSupported) return
    // Some browsers load voices asynchronously; touching the list warms it up.
    window.speechSynthesis.getVoices()
    const warm = () => window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener("voiceschanged", warm)
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", warm)
      run.current += 1
      window.speechSynthesis.cancel()
    }
  }, [])

  function stop() {
    run.current += 1
    if (speechSupported) window.speechSynthesis.cancel()
    setPlaying(false)
    setActive(-1)
  }

  function play(event: FormEvent) {
    event.preventDefault()
    const script = scriptFor(name, type)
    setLines(script)
    if (!speechSupported) {
      setActive(-1)
      return
    }

    window.speechSynthesis.cancel()
    const id = run.current + 1
    run.current = id
    const { agent, caller } = pickVoices()
    setPlaying(true)

    const speak = (index: number) => {
      if (run.current !== id) return
      if (index >= script.length) {
        setPlaying(false)
        setActive(-1)
        return
      }
      const line = script[index]
      const utterance = new SpeechSynthesisUtterance(line.text)
      const voice = line.speaker === "ai" ? agent : caller
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else {
        utterance.lang = "en-GB"
      }
      utterance.rate = line.speaker === "ai" ? 1.02 : 1.05
      utterance.pitch = line.speaker === "ai" ? 1.05 : 0.9
      utterance.onstart = () => {
        if (run.current === id) setActive(index)
      }
      utterance.onend = () => window.setTimeout(() => speak(index + 1), 280)
      utterance.onerror = () => {
        if (run.current === id) {
          setPlaying(false)
          setActive(-1)
        }
      }
      window.speechSynthesis.speak(utterance)
    }
    speak(0)
  }

  const label = businessTypes.find((item) => item.value === type)?.label ?? "business"

  return (
    <GlassCard lift={false} className="p-5 sm:p-7">
      <p className="eyebrow text-muted-ink">Build your agent</p>
      <h3 className="mt-3 text-[1.5rem] tracking-[-0.03em] text-ink sm:text-[1.75rem]">
        Type your business. Hear your receptionist.
      </h3>
      <p className="mt-2 max-w-2xl text-muted-ink">
        Enter your business name and type, and we&apos;ll play a sample call answered in your name.
      </p>

      <form onSubmit={play} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <Label htmlFor="agent-business-name">Business name</Label>
          <Input
            id="agent-business-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Bright Smile Dental"
            maxLength={60}
            autoComplete="organization"
            className="h-12 rounded-full border-hairline bg-white px-5 text-base md:text-base"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="agent-business-type">Business type</Label>
          <select
            id="agent-business-type"
            value={type}
            onChange={(event) => setType(event.target.value as BusinessType)}
            className="h-12 w-full appearance-none rounded-full border border-hairline bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230b0b0c%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_1.1rem_center] bg-no-repeat px-5 pr-10 text-base text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
          >
            {businessTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <Magnetic className="w-full sm:w-auto">
          {playing ? (
            <Button
              type="button"
              onClick={stop}
              variant="outline"
              className="h-12 w-full rounded-full border-hairline bg-white px-6 text-[15px] font-medium text-ink hover:bg-white sm:w-auto"
            >
              <Square className="size-3.5 fill-current" strokeWidth={1.5} aria-hidden="true" />
              Stop
            </Button>
          ) : (
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-brand px-6 text-[15px] font-medium tracking-[-0.01em] text-ink shadow-none hover:bg-brand/85 sm:w-auto"
            >
              <Volume2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Hear your agent
            </Button>
          )}
        </Magnetic>
      </form>

      {!speechSupported ? (
        <p className="mt-4 text-sm text-muted-ink" role="status">
          Your browser can&apos;t play audio previews, so here&apos;s the script instead.
        </p>
      ) : null}

      <AnimatePresence>
        {lines.length > 0 ? (
          <motion.ol
            key={`${name}-${type}-${lines[0]?.text}`}
            className="mt-6 space-y-3 border-t border-hairline pt-6"
            aria-label={`Sample call for ${name.trim() || "your business"}, a ${label.toLowerCase()}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.4, ease: EASE }}
          >
            {lines.map((line, index) => {
              const caller = line.speaker === "caller"
              const current = active === index
              return (
                <li key={`${index}-${line.speaker}`} className={cn("flex", caller ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[min(100%,36rem)] rounded-[22px] px-4 py-3 transition-shadow duration-300",
                      caller ? "bg-ink text-white" : "border border-hairline bg-white",
                      current && "ring-2 ring-brand ring-offset-2 ring-offset-white",
                    )}
                    aria-current={current ? "true" : undefined}
                  >
                    <p className={cn("font-mono text-[11px] tracking-wide", caller ? "text-white/60" : "text-muted-ink")}>
                      {caller ? "Caller" : "Your AI receptionist"}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed sm:text-base">{line.text}</p>
                  </div>
                </li>
              )
            })}
          </motion.ol>
        ) : null}
      </AnimatePresence>

      <p className="mt-5 text-sm text-muted-ink">
        Preview uses your browser&apos;s built-in voice. Your real agent gets a natural, custom voice and is trained on your services, prices and calendar.
      </p>
    </GlassCard>
  )
}
