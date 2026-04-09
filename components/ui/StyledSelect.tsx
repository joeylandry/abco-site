type StyledSelectOption = {
  value: string
  label: string
}

type StyledSelectProps = {
  id: string
  value: string
  options: StyledSelectOption[]
  onChange: (value: string) => void
  className?: string
  selectClassName?: string
}

export default function StyledSelect({
  id,
  value,
  options,
  onChange,
  className = "",
  selectClassName = "",
}: StyledSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`min-w-[200px] appearance-none rounded-full border border-black/20 bg-surface px-5 py-2.5 pr-10 text-sm font-semibold tracking-wide text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-black/35 focus:border-black/20 focus:outline-none focus:shadow-none focus-visible:border-black/20 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none active:border-black/20 active:outline-none active:shadow-none ${selectClassName}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-foreground/70"
      >
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1.25L6 6.25L11 1.25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </div>
  )
}
