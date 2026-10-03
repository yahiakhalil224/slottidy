export type Currency = "GBP" | "USD"

export function monthlyEstimate(
  missedPerWeek: number,
  bookRate: number,
  avgValue: number,
) {
  return missedPerWeek * (bookRate / 100) * avgValue * 4.33
}

export function yearlyEstimate(
  missedPerWeek: number,
  bookRate: number,
  avgValue: number,
) {
  return monthlyEstimate(missedPerWeek, bookRate, avgValue) * 12
}

export function formatMoney(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const whole = Math.floor(seconds)
  const minutes = Math.floor(whole / 60)
  const remain = whole % 60
  return `${minutes}:${remain.toString().padStart(2, "0")}`
}
