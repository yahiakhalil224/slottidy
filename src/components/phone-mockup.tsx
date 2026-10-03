import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { SpeechWave } from "@/components/speech-wave"
import { EASE, useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative mx-auto w-[250px] max-w-full", className)}>
      <div
        className="relative aspect-[9/19.2] rounded-[2.15rem] bg-[#07080c] p-[9px] shadow-[0_40px_80px_-36px_rgba(11,11,15,0.65)] ring-1 ring-white/15"
        aria-hidden="true"
      >
        <div className="relative h-full overflow-hidden rounded-[1.65rem] bg-[#101218]">
          <div className="absolute top-2 left-1/2 z-10 h-[18px] w-[88px] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  )
}

export function PhoneScreen({
  step,
  active,
}: {
  step: number
  active: boolean
}) {
  if (step === 0) return <Incoming active={active} />
  if (step === 1) return <Answering active={active} />
  if (step === 2) return <Booked active={active} />
  if (step === 3) return <Sms active={active} />
  return <Arrived active={active} />
}

function ScreenShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("flex h-full flex-col px-4 pt-10 pb-5 text-white", className)}>{children}</div>
}

function Incoming({ active }: { active: boolean }) {
  return (
    <ScreenShell className="items-center justify-center text-center">
      <p className="font-mono text-[10px] tracking-[0.16em] text-white/50">7:42 PM</p>
      <p className="mt-6 font-heading text-lg tracking-[-0.03em]">Brightside Dental</p>
      <p className="mt-1 text-sm text-white/60">Incoming</p>
      <div className="relative mt-8 grid size-24 place-items-center">
        {active ? (
          <>
            <span className="absolute inset-0 rounded-full border border-brand/50" style={{ animation: "ring-pulse 1.8s ease-out infinite" }} />
            <span className="absolute inset-0 rounded-full border border-brand/40" style={{ animation: "ring-pulse 1.8s ease-out 0.6s infinite" }} />
          </>
        ) : null}
        <span className="relative grid size-16 place-items-center rounded-full bg-brand text-ink">
          <PhoneIcon />
        </span>
      </div>
    </ScreenShell>
  )
}

function Answering({ active }: { active: boolean }) {
  return (
    <ScreenShell>
      <p className="font-mono text-[10px] tracking-[0.16em] text-brand">ON THE CALL</p>
      <p className="mt-3 font-heading text-lg tracking-[-0.03em]">Brightside Dental</p>
      <p className="text-sm text-white/60">Virtual assistant</p>
      <div className="mt-8 text-brand">
        <SpeechWave count={28} active={active} className="h-16" />
      </div>
      <p className="mt-6 text-sm leading-relaxed text-white/80">
        I can offer Wednesday at 9:15 am or Thursday at 2:40 pm.
      </p>
    </ScreenShell>
  )
}

function Booked({ active }: { active: boolean }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  return (
    <ScreenShell>
      <p className="font-mono text-[10px] tracking-[0.16em] text-white/45">CALENDAR</p>
      <p className="mt-2 font-heading text-lg tracking-[-0.03em]">This week</p>
      <div className="mt-5 grid grid-cols-5 gap-1.5">
        {days.map((day) => (
          <div
            key={day}
            className={cn(
              "rounded-xl px-1 py-2 text-center",
              day === "Thu" ? "bg-brand text-ink" : "bg-white/6 text-white/70",
            )}
          >
            <p className="font-mono text-[9px] tracking-wide">{day}</p>
            <p className="mt-1 text-xs">{day === "Thu" ? "2:40" : "—"}</p>
          </div>
        ))}
      </div>
      <motion.div
        initial={active ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-5 rounded-2xl bg-white/8 px-3 py-3"
      >
        <p className="text-sm text-brand">Booked: Thu 2:40 pm</p>
        <p className="mt-1 text-xs text-white/55">Dr Patel · check-up</p>
      </motion.div>
    </ScreenShell>
  )
}

function Sms({ active }: { active: boolean }) {
  const reduced = useReducedMotion()
  return (
    <ScreenShell className="justify-end">
      <p className="mb-auto font-mono text-[10px] tracking-[0.16em] text-white/45">MESSAGES</p>
      <motion.div
        initial={reduced || !active ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0.15 } : { duration: 0.5, ease: EASE }}
        className="rounded-[20px] rounded-bl-md bg-white px-3.5 py-3 text-ink"
      >
        <p className="text-[13px] leading-relaxed">
          Hi Sarah, you&apos;re booked at Brightside Dental on Thu at 2:40 pm. Reply C to confirm or R to reschedule.
        </p>
      </motion.div>
      <p className="mt-3 text-center font-mono text-[10px] text-white/40">SMS · just now</p>
    </ScreenShell>
  )
}

function Arrived({ active }: { active: boolean }) {
  return (
    <ScreenShell className="items-center justify-center text-center">
      <div
        className={cn(
          "grid size-20 place-items-center rounded-full bg-brand/15 text-brand",
          active && "shadow-[0_0_40px_rgba(0,209,160,0.35)]",
        )}
      >
        <span className="font-heading text-3xl">✓</span>
      </div>
      <p className="mt-5 font-heading text-xl tracking-[-0.03em]">Checked in</p>
      <p className="mt-2 text-sm text-white/60">Thu · 2:40 pm · Sarah</p>
    </ScreenShell>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 4.5h3l1.5 3.5-2 1.2a12 12 0 0 0 5.8 5.8l1.2-2 3.5 1.5v3A1.5 1.5 0 0 1 18 19 14.5 14.5 0 0 1 5 6a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  )
}
