import { useEffect, useState } from "react"
import { useSpring } from "framer-motion"
import { BookCall } from "@/components/book-call"
import { GlassCard } from "@/components/glass-card"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import {
  formatMoney,
  monthlyEstimate,
  yearlyEstimate,
  type Currency,
} from "@/lib/estimate"
import { useReducedMotion } from "@/lib/motion"

export default function Calculator() {
  const reduced = useReducedMotion()
  const [missed, setMissed] = useState(15)
  const [rate, setRate] = useState(30)
  const [value, setValue] = useState(250)
  const [currency, setCurrency] = useState<Currency>("GBP")

  const monthly = monthlyEstimate(missed, rate, value)
  const yearly = yearlyEstimate(missed, rate, value)
  const spring = useSpring(monthly, { stiffness: 80, damping: 18, mass: 0.7 })
  const [shown, setShown] = useState(monthly)
  const [announced, setAnnounced] = useState(monthly)

  useEffect(() => {
    if (reduced) return
    spring.set(monthly)
  }, [monthly, reduced, spring])

  useEffect(() => {
    if (reduced) return
    return spring.on("change", (next) => setShown(next))
  }, [reduced, spring])

  useEffect(() => {
    const id = window.setTimeout(() => setAnnounced(monthly), 350)
    return () => window.clearTimeout(id)
  }, [monthly])

  return (
    <section id="calculator" aria-labelledby="calculator-title" className="section-space bg-canvas">
      <div className="shell grid items-start gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            eyebrow="Calculator"
            id="calculator-title"
            title="What are missed calls costing you?"
            intro="Plug in your own numbers. It takes 20 seconds."
          />
          <p className="mt-6 max-w-md text-sm text-muted-ink">
            This is a rough estimate based on the numbers you enter. It isn&apos;t a guarantee or a
            prediction of results. Real outcomes depend on your clinic, your call volume and your
            patients.
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <GlassCard lift={false} className="p-5 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <p className="font-mono text-[12px] tracking-[0.14em] text-muted-ink uppercase">Your numbers</p>
              <div className="flex gap-1" role="group" aria-label="Currency">
                <Toggle
                  pressed={currency === "GBP"}
                  onPressedChange={() => setCurrency("GBP")}
                  aria-label="Pounds"
                  className="rounded-full px-3 data-[state=on]:bg-ink data-[state=on]:text-white"
                >
                  £
                </Toggle>
                <Toggle
                  pressed={currency === "USD"}
                  onPressedChange={() => setCurrency("USD")}
                  aria-label="Dollars"
                  className="rounded-full px-3 data-[state=on]:bg-ink data-[state=on]:text-white"
                >
                  $
                </Toggle>
              </div>
            </div>

            <div className="space-y-7">
              <Field
                id="missed-calls"
                label="Missed calls per week"
                min={0}
                max={200}
                value={missed}
                onChange={setMissed}
              />
              <Field
                id="book-rate"
                label="Percentage who would have booked"
                min={0}
                max={100}
                suffix="%"
                value={rate}
                onChange={setRate}
              />
              <Field
                id="patient-value"
                label="Average patient value"
                min={0}
                max={5000}
                value={value}
                onChange={setValue}
                prefix={currency === "GBP" ? "£" : "$"}
              />
            </div>

            <div className="mt-8 border-t border-hairline pt-6">
              <p className="font-heading text-[clamp(2.4rem,5vw,4rem)] leading-none tracking-[-0.04em] text-brand-text tabular-nums" aria-hidden="true">
                ≈ {formatMoney(reduced ? monthly : shown, currency)}
                <span className="ml-2 font-sans text-lg font-medium tracking-normal text-muted-ink">/ month</span>
              </p>
              <p className="mt-3 text-muted-ink tabular-nums" aria-hidden="true">
                ≈ {formatMoney(yearly, currency)} / year
              </p>
              <p className="sr-only" aria-live="polite">
                Approximately {formatMoney(announced, currency)} per month, and{" "}
                {formatMoney(yearlyEstimate(missed, rate, value), currency)} per year. This is a rough
                estimate, not a guarantee.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-start gap-3">
              <p className="text-ink">Let&apos;s see how many of those calls we can catch.</p>
              <BookCall cta="calculator">Book a Call</BookCall>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  min,
  max,
  value,
  onChange,
  prefix,
  suffix,
}: {
  id: string
  label: string
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
}) {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex items-center gap-1">
          {prefix ? <span className="text-sm text-muted-ink">{prefix}</span> : null}
          <Input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={value}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (Number.isNaN(next)) return
              onChange(Math.min(max, Math.max(min, next)))
            }}
            className="h-10 w-24 rounded-full text-right tabular-nums"
          />
          {suffix ? <span className="text-sm text-muted-ink">{suffix}</span> : null}
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(next) => onChange(next[0] ?? min)}
        aria-label={label}
      />
    </div>
  )
}
