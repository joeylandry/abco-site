type MobileDrawerHeaderProps = {
  eyebrow?: string
  title: string
  closeLabel: string
  onClose: () => void
  titleClassName?: string
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.9]"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

export default function MobileDrawerHeader({
  eyebrow = "Menu",
  title,
  closeLabel,
  onClose,
  titleClassName,
}: MobileDrawerHeaderProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-black/10 bg-background/95 px-4 py-4 backdrop-blur">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="pt-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-black/50">
          {eyebrow}
        </p>
        <h2
          className={`mt-2 font-heading text-2xl leading-tight text-foreground ${
            titleClassName ?? ""
          }`}
        >
          {title}
        </h2>
      </div>
    </div>
  )
}
