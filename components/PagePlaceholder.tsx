export default function PagePlaceholder({
    title,
    subtitle,
    accent = "bg-white",
    badge,
  }: {
    title: string;
    subtitle?: string;
    accent?: string;
    badge?: string;
  }) {
    return (
      <section className={`${accent} py-14 md:py-16`}>
        <div className="mx-auto max-w-6xl px-4">
          {badge && (
            <span className="mb-4 inline-block rounded-full bg-black px-3 py-1 text-xs uppercase tracking-wide text-white">
              {badge}
            </span>
          )}
  
          <h1 className="text-4xl font-bold text-black">{title}</h1>
  
          {subtitle && (
            <p className="mt-4 max-w-2xl text-lg text-gray-800">
              {subtitle}
            </p>
          )}
        </div>
      </section>
    );
  }
