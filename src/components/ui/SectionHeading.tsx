type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {eyebrow ? (
        <p className="font-head text-xs font-semibold uppercase tracking-[0.28em] text-vv-bronze-text">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[0.02em] text-vv-ink sm:text-4xl md:text-5xl">
        {heading}
      </h2>
    </div>
  );
}
