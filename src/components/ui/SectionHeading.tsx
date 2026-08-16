type SectionHeadingProps = {
  eyebrow?: string;
  /** A single line, or multiple lines rendered with <br /> between them
   * (matching the hero's own two-line pattern). */
  heading: string | readonly string[];
  align?: "left" | "center";
  className?: string;
  /** OVERNIGHT AUDIT: every secondary page's only heading came through
   * here as a hard-coded <h2> — since PageIntro (the sole caller that
   * opens a page, always first, never alongside another top-level
   * heading) used the same default, every non-home page shipped with no
   * <h1> at all. Defaults to "h2" (unchanged behavior for every homepage
   * section, which sits below Hero's own <h1>); PageIntro now passes
   * "h1" explicitly. */
  level?: "h1" | "h2";
};

export default function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  className = "",
  level = "h2",
}: SectionHeadingProps) {
  const lines = Array.isArray(heading) ? heading : [heading];
  const Heading = level;

  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {eyebrow ? (
        <p className="font-head text-xs font-semibold uppercase tracking-[0.28em] text-vv-bronze-text">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="mt-3 font-display text-3xl font-semibold uppercase tracking-[0.02em] text-vv-ink sm:text-4xl md:text-5xl">
        {lines.map((line, i) => (
          <span key={line}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </Heading>
    </div>
  );
}
