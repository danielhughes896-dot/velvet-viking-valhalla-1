type SectionHeadingProps = {
  eyebrow?: string;
  /** A single line, or multiple lines rendered with <br /> between them
   * (matching the hero's own two-line pattern). */
  heading: string | readonly string[];
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const lines = Array.isArray(heading) ? heading : [heading];

  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {eyebrow ? (
        <p className="font-head text-xs font-semibold uppercase tracking-[0.28em] text-vv-bronze-text">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[0.02em] text-vv-ink sm:text-4xl md:text-5xl">
        {lines.map((line, i) => (
          <span key={line}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}
