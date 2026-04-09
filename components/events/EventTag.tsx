type EventTagProps = {
  label?: string
  iconOnly?: boolean
}

export default function EventTag({ label, iconOnly = false }: EventTagProps) {
  if (iconOnly) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#1f6d43]/18 bg-[#dff6e8] text-[#1f6d43]">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 fill-current"
        >
          <path d="M12 2.75l2.56 5.19 5.73.83-4.15 4.04.98 5.71L12 15.84l-5.12 2.68.98-5.71L3.7 8.77l5.73-.83L12 2.75z" />
        </svg>
      </span>
    )
  }

  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1f6d43]/18 bg-[#dff6e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1f6d43]">
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 fill-current"
      >
        <path d="M12 2.75l2.56 5.19 5.73.83-4.15 4.04.98 5.71L12 15.84l-5.12 2.68.98-5.71L3.7 8.77l5.73-.83L12 2.75z" />
      </svg>
      {label}
    </span>
  )
}
