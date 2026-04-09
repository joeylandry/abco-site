import Link from "next/link"
import clsx from "clsx"

type ButtonBaseProps = {
  variant?: "primary" | "secondary"
  children: React.ReactNode
  className?: string
}

type ButtonAsLinkProps = ButtonBaseProps &
  { href: string } & Omit<React.ComponentPropsWithoutRef<"a">, "href" | "className" | "children">

type ButtonAsButtonProps = ButtonBaseProps &
  { href?: undefined } & Omit<React.ComponentPropsWithoutRef<"button">, "className" | "children">

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground/80"

  const hasCustomBg = /\b!?bg-/.test(className)
  const hasCustomText = /\b!?text-/.test(className)

  const styles =
    variant === "primary"
      ? clsx(
          !hasCustomBg && "bg-background",
          !hasCustomText && "text-foreground",
          "shadow-lg shadow-black/20 hover:opacity-90 hover:-translate-y-0.5"
        )
      : "border border-background text-background hover:bg-background hover:text-foreground hover:-translate-y-0.5"

  const finalClass = `${base} ${styles} ${className}`

  if (href) {
    const linkProps = props as Omit<ButtonAsLinkProps, "href">

    return (
      <Link href={href} className={finalClass} {...linkProps}>
        {children}
      </Link>
    )
  }

  return (
    <button className={finalClass} {...(props as ButtonAsButtonProps)}>
      {children}
    </button>
  )
}
