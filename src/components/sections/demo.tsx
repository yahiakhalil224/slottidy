import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"
import { Magnetic } from "@/components/magnetic"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { site } from "@/config/site"
import { formatClock } from "@/lib/estimate"
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

function stamp(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remain = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remain.toString().padStart(2, "0")}`
}

export default function Demo() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState<1 | 1.5>(1)
  const [failed, setFailed] = useState(false)

  const placeholder = site.demoAudioUrl.startsWith("[")
  const progress = duration > 0 ? Math.min(1, time / duration) : 0
  const activeIndex = transcript.reduce((current, line, index) => (time >= line.t ? index : current), -1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = rate
  }, [rate])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || failed || placeholder) {
      setFailed(true)
      return
    }
    if (audio.paused) {
      void audio.play().catch(() => setFailed(true))
    } else {
      audio.pause()
    }
  }

  function seek(value: number) {
    const audio = audioRef.current
    if (!audio || failed || !Number.isFinite(duration) || duration <= 0) return
    audio.currentTime = value
    setTime(value)
  }

  return (
    <section id="demo" aria-labelledby="demo-title" className="section-space bg-canvas">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Demo"
            id="demo-title"
            title="Don't take our word for it. Listen."
            intro="This is a demo call recorded for a sample dental clinic. It's not a real patient, just an example of how your AI receptionist could sound."
          />
        </Reveal>

        <Reveal className="mt-10">
          <GlassCard lift={false} className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Magnetic>
                <Button
                  type="button"
                  onClick={togglePlay}
                  aria-pressed={playing}
                  className="size-14 rounded-full bg-ink text-white hover:bg-ink/90"
                  aria-label={playing ? "Pause demo" : "Play demo"}
                >
                  {playing ? <Pause strokeWidth={1.5} /> : <Play className="ml-0.5" strokeWidth={1.5} />}
                  <span className="size-2 rounded-full bg-brand transition-transform duration-300 group-hover/button:scale-150" />
                </Button>
              </Magnetic>

              <div className="relative min-w-0 flex-1">
                <div className="flex h-14 items-end gap-[3px]" aria-hidden="true">
                  {waveform.map((height, index) => {
                    const filled = progress > 0 && index / waveform.length <= progress
                    return (
                      <span
                        key={`${height}-${index}`}
                        className={cn(
                          "w-[3px] flex-1 origin-bottom rounded-full",
                          filled ? "bg-brand" : "bg-ink/15",
                        )}
                        style={{ height: `${Math.max(12, height * 100)}%` }}
                      />
                    )
                  })}
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(time, duration || 0)}
                  onChange={(event) => seek(Number(event.target.value))}
                  disabled={failed || placeholder || duration <= 0}
                  aria-label="Seek demo audio"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <p className="font-mono text-sm text-muted-ink tabular-nums">
                  {formatClock(time)} / {formatClock(duration)}
                </p>
                <div className="flex gap-1" role="group" aria-label="Playback speed">
                  <Toggle
                    pressed={rate === 1}
                    onPressedChange={() => setRate(1)}
                    aria-label="Play at normal speed"
                    className="rounded-full px-3 data-[state=on]:bg-ink data-[state=on]:text-white"
                  >
                    1x
                  </Toggle>
                  <Toggle
                    pressed={rate === 1.5}
                    onPressedChange={() => setRate(1.5)}
                    aria-label="Play at 1.5 times speed"
                    className="rounded-full px-3 data-[state=on]:bg-ink data-[state=on]:text-white"
                  >
                    1.5x
                  </Toggle>
                </div>
              </div>
            </div>

            {failed || placeholder ? (
              <p className="mt-4 text-sm text-muted-ink" role="status">
                The sample recording will play here once it&apos;s added. The player stays ready.
              </p>
            ) : null}

            <audio
              ref={audioRef}
              src={site.demoAudioUrl}
              preload="none"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
              onError={() => setFailed(true)}
            />
          </GlassCard>
        </Reveal>

        <ol className="mt-8 space-y-3" aria-label="Sample transcript">
          {transcript.map((line, index) => {
            const active = activeIndex === index && time > 0
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
                aria-current={active ? "true" : undefined}
              >
                <div
                  className={cn(
                    "max-w-[min(100%,36rem)] rounded-[22px] px-4 py-3",
                    caller ? "bg-ink text-white" : "border border-hairline bg-white/70 backdrop-blur-xl",
                    active && "ring-2 ring-brand-text",
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
