type FilterTagButtonProps = {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export default function FilterTagButton({
  label,
  active = false,
  onClick,
  className = "",
}: FilterTagButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide capitalize transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  const stateStyles = active
    ? "bg-foreground text-background shadow-sm shadow-black/10"
    : "border border-foreground/20 bg-surface text-foreground/80 hover:-translate-y-0.5 hover:border-foreground/35 hover:bg-abco-blue/20"

  return (
    <button type="button" onClick={onClick} className={`${base} ${stateStyles} ${className}`}>
      {label}
    </button>
  )
}
