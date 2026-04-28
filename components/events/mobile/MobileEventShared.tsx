export function CalendarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
    >
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18" />
      <path d="M8 3.5v4" />
      <path d="M16 3.5v4" />
      <path d="M8.5 13.5h.01" />
      <path d="M12 13.5h.01" />
      <path d="M15.5 13.5h.01" />
      <path d="M8.5 17h.01" />
      <path d="M12 17h.01" />
      <path d="M15.5 17h.01" />
    </svg>
  )
}

const MOBILE_EVENT_MONTHS: Record<string, string> = {
  Jan: "1",
  Feb: "2",
  Mar: "3",
  Apr: "4",
  May: "5",
  Jun: "6",
  Jul: "7",
  Aug: "8",
  Sep: "9",
  Oct: "10",
  Nov: "11",
  Dec: "12",
}

export function formatMobileEventBackDate(weekday: string, month: string, day: number | string) {
  const monthNumber = MOBILE_EVENT_MONTHS[month]

  if (!monthNumber) {
    return `${weekday.toUpperCase()} ${month} ${day}`
  }

  return `${weekday.toUpperCase()} ${monthNumber}/${day}`
}

export function MobileEventBadge({
  label,
  mutedTextColor,
  compact = false,
}: {
  label: string
  mutedTextColor: string
  compact?: boolean
}) {
  const badgeClassName = compact
    ? "inline-flex items-center gap-1.5 rounded-full border border-current/15 bg-white/12 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.15em] shadow-[0_10px_22px_rgba(0,0,0,0.08)] backdrop-blur-sm"
    : "inline-flex items-center gap-2 rounded-full border border-current/15 bg-white/12 px-3.5 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] shadow-[0_10px_22px_rgba(0,0,0,0.08)] backdrop-blur-sm"

  return (
    <span
      className={badgeClassName}
      style={{ color: mutedTextColor }}
    >
      <CalendarIcon />
      {label}
    </span>
  )
}

export function MobileEventDateStack({
  weekday,
  month,
  day,
  mutedTextColor,
  monthClassName = "font-heading text-[clamp(3rem,13vw,4.5rem)] leading-none uppercase tracking-[0.1em]",
  dayClassName = "mt-1 font-heading text-[clamp(5rem,26vw,7.4rem)] leading-none",
  weekdayClassName = "font-heading text-[clamp(0.95rem,4.2vw,1.25rem)] leading-none uppercase tracking-[0.18em]",
}: {
  weekday: string
  month: string
  day: number | string
  mutedTextColor?: string
  monthClassName?: string
  dayClassName?: string
  weekdayClassName?: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className={weekdayClassName} style={mutedTextColor ? { color: mutedTextColor } : undefined}>
        {weekday}
      </p>
      <p className={monthClassName}>{month}</p>
      <p className={dayClassName}>{day}</p>
    </div>
  )
}
