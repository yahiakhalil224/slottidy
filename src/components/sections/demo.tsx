import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { RetellWebClient } from "retell-client-js-sdk"
import { GlassCard } from "@/components/glass-card"
import { Magnetic } from "@/components/magnetic"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { EASE, useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

const waveform = [
  0.3, 0.45, 0.7, 0.4, 0.85, 0.55, 0.35, 0.9, 0.6, 0.42, 0.78, 0.5, 0.33, 0.88, 0.62, 0.4, 0.72,
  0.95, 0.48, 0.36, 0.8, 0.58, 0.44, 0.92, 0.5, 0.38, 0.7, 0.84, 0.46, 0.32, 0.76, 0.6, 0.41, 0.87,
  0.53, 0.34, 0.69, 0.91, 0.47, 0.37, 0.74, 0.58, 0.43, 0.82, 0.51, 0.35, 0.66, 0.89, 0.48, 0.4, 0.73,
  0.57, 0.33, 0.8, 0.46, 0.62,
]

const transcript = [
  { t: 0, speaker: "ai", text: "Hi, thanks for calling Brightside Dental. I'm the clinic's virtual assistant. How can I help today?" },
  { t: 5, speaker: "caller", text: "Hi, I've chipped a tooth and wondered if you had anything this week?" },
  { t: 10, speaker: "ai", text: "Sorry to hear that. Are you in any pain at the moment, or is it more of a cosmetic chip?" },
  { t: 15, speaker: "caller", text: "A little sensitive, but not too bad." },
  { t: 18, speaker: "ai", text: "Okay. I can offer you Wednesday at 9:15 am or Thursday at 2:40 pm with Dr Patel. Which works better?" },
  { t: 24, speaker: "caller", text: "Thursday's great." },
  { t: 26, speaker: "ai", text: "Lovely. Can I take your full name and mobile number?" },
  { t: 35, speaker: "ai", text: "You're booked in for Thursday at 2:40 pm. I'll text you a confirmation now, plus a reminder the day before. Anything else I can help with?" },
  { t: 41, speaker: "caller", text: "No, that's perfect, thanks!" },
] as const

const microphoneBlocked =
  "Your microphone is blocked. Allow access in your browser, then try again."
const microphoneMissing =
  "We couldn't find a microphone. Check it's connected, then try again."
const callFailed = "We couldn't start the call. Please try again in a moment."

type CallStatus = "idle" | "connecting" | "live" | "ended"

function stamp(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remain = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remain.toString().padStart(2, "0")}`
}

function errorName(error: unknown) {
  if (typeof error !== "object" || error === null || !("name" in error)) return ""
  return typeof error.name === "string" ? error.name : ""
}

function isMicrophoneBlocked(error: unknown) {
  const name = errorName(error)
  if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
    return true
  }
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : ""
  return /notallowederror|permission denied/i.test(message)
}

function isMicrophoneMissing(error: unknown) {
  const name = errorName(error)
  return name === "NotFoundError" || name === "DevicesNotFoundError"
}

function friendlyError(error: unknown) {
  if (isMicrophoneBlocked(error)) return microphoneBlocked
  if (isMicrophoneMissing(error)) return microphoneMissing
  return callFailed
}

async function ensureMicrophone() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException("Microphone is blocked", "NotAllowedError")
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  for (const track of stream.getTracks()) track.stop()
}

async function fetchAccessToken() {
  const response = await fetch("/api/create-web-call", { method: "POST" })
  const payload: unknown = await response.json().catch(() => null)
  const token =
    typeof payload === "object" &&
    payload !== null &&
    "access_token" in payload &&
    typeof payload.access_token === "string"
      ? payload.access_token
      : ""
  if (!response.ok || token.length === 0) {
    throw new Error("unavailable")
  }
  return token
}

function statusLabel(status: CallStatus, error: string | null) {
  if (status === "connecting") return "Connecting…"
  if (status === "live") return "Live"
  if (status === "ended") return "Call ended"
  if (error) return ""
  return "Ready"
}

function SophieCall() {
  const reduced = useReducedMotion()
  const clientRef = useRef<RetellWebClient | null>(null)
  const generation = useRef(0)
  const attempt = useRef(0)
  const outcome = useRef<"pending" | "live" | "error">("pending")
  const [status, setStatus] = useState<CallStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const client = new RetellWebClient()
    clientRef.current = client

    const current = () => attempt.current === generation.current

    client.on("call_started", () => {
      if (!current()) return
      outcome.current = "live"
      setError(null)
      setStatus("live")
    })
    client.on("call_ended", () => {
      if (!current()) return
      setStatus("ended")
    })
    client.on("error", (message: unknown) => {
      if (!current()) return
      outcome.current = "error"
      setError(friendlyError(message))
      setStatus((currentStatus) => (currentStatus === "live" ? "ended" : "idle"))
    })

    return () => {
      generation.current += 1
      client.stopCall()
      client.removeAllListeners()
      clientRef.current = null
    }
  }, [])

  async function startCall() {
    const client = clientRef.current
    if (!client || status === "connecting" || status === "live") return

    const id = generation.current + 1
    generation.current = id
    attempt.current = id
    outcome.current = "pending"
    setError(null)
    setStatus("connecting")

    try {
      await ensureMicrophone()
      if (generation.current !== id) return
      const accessToken = await fetchAccessToken()
      if (generation.current !== id) return
      await client.startCall({ accessToken })
      if (generation.current !== id) {
        client.stopCall()
        return
      }
      if (outcome.current === "pending") {
        setError(callFailed)
        setStatus("idle")
      }
    } catch (caught) {
      if (generation.current !== id) return
      outcome.current = "error"
      setError(friendlyError(caught))
      setStatus("idle")
      client.stopCall()
    }
  }

  function endCall() {
    generation.current += 1
    clientRef.current?.stopCall()
    setError(null)
    setStatus("ended")
  }

  const label = statusLabel(status, error)
  const live = status === "live"

  return (
    <GlassCard lift={false} className="p-5 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Magnetic className="w-full sm:w-auto">
          {live ? (
            <Button
              type="button"
              onClick={endCall}
              variant="outline"
              className="h-12 w-full rounded-full border-hairline bg-white px-6 text-[15px] font-medium text-ink hover:bg-white sm:w-auto"
            >
              End call
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => void startCall()}
              disabled={status === "connecting"}
              aria-describedby="sophie-demo-note"
              aria-busy={status === "connecting"}
              className="h-auto min-h-12 w-full whitespace-normal rounded-full bg-ink px-6 py-3 text-center text-[15px] font-medium tracking-[-0.01em] text-white shadow-none hover:bg-ink/90 sm:w-auto"
            >
              {status === "connecting" ? "Connecting…" : "Talk to Sophie, our AI receptionist"}
              {status === "connecting" ? null : (
                <span
                  aria-hidden="true"
                  className="ml-1 size-2 shrink-0 rounded-full bg-brand transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/button:scale-150"
                />
              )}
            </Button>
          )}
        </Magnetic>

        <div className="flex h-14 min-w-0 flex-1 items-end gap-[3px]" aria-hidden="true">
          {waveform.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className={cn(
                "w-[3px] flex-1 origin-bottom rounded-full",
                live ? "bg-brand wave-bar" : "bg-ink/15",
              )}
              style={{
                height: `${Math.max(12, height * 100)}%`,
                animationDelay: live && !reduced ? `${(index % 8) * 0.12}s` : undefined,
              }}
            />
          ))}
        </div>

        <p
          className="font-mono text-sm text-muted-ink sm:min-w-28 sm:text-right"
          role="status"
          aria-live="polite"
        >
          {live ? (
            <span className="inline-flex items-center gap-2 sm:justify-end">
              <span
                className="size-1.5 rounded-full bg-brand"
                style={reduced ? undefined : { animation: "live-dot 1.6s ease-in-out infinite" }}
              />
              Live
            </span>
          ) : (
            label || "\u00a0"
          )}
        </p>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-muted-ink" role="alert">
          {error}
        </p>
      ) : null}

      <p id="sophie-demo-note" className="mt-4 text-sm text-muted-ink">
        Live demo for a fictional clinic, Bright Smile Dental. Uses your microphone.
      </p>
    </GlassCard>
  )
}

export default function Demo() {
  const reduced = useReducedMotion()

  return (
    <section id="demo" aria-labelledby="demo-title" className="section-space bg-canvas">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Demo"
            id="demo-title"
            title="Don't take our word for it. Listen."
            intro="Talk to Sophie, or read a sample call for a fictional dental clinic. It's not a real patient, just an example of how your AI receptionist could sound."
          />
        </Reveal>

        <Reveal className="mt-10">
          <SophieCall />
        </Reveal>

        <ol className="mt-8 space-y-3" aria-label="Sample transcript">
          {transcript.map((line, index) => {
            const caller = line.speaker === "caller"
            return (
              <motion.li
                key={`${line.t}-${line.speaker}`}
                className={cn("flex", caller ? "justify-end" : "justify-start")}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={
                  reduced
                    ? { duration: 0.15, delay: Math.min(index * 0.02, 0.08) }
                    : { duration: 0.55, delay: index * 0.08, ease: EASE }
                }
              >
                <div
                  className={cn(
                    "max-w-[min(100%,36rem)] rounded-[22px] px-4 py-3",
                    caller ? "bg-ink text-white" : "border border-hairline bg-white/70 backdrop-blur-xl",
                  )}
                >
                  <p className={cn("font-mono text-[11px] tracking-wide", caller ? "text-white/60" : "text-muted-ink")}>
                    {stamp(line.t)} · {caller ? "Caller" : "AI"}
                  </p>
                  <p className="mt-1 text-[15px] leading-relaxed sm:text-base">{line.text}</p>
                </div>
              </motion.li>
            )
          })}
        </ol>

        <p className="mt-5 text-sm text-muted-ink">
          Sample transcript of a demo call. Names and clinic are fictional.
        </p>
      </div>
    </section>
  )
}
