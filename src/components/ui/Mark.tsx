import Image from "next/image";
import mark from "../../../public/brand/velvet-viking-mark.png";

type MarkProps = {
  /** Rendered WIDTH. The height follows the artwork's own proportions. */
  size?: number | string;
  className?: string;
  /** Decorative uses (beside a wordmark that already names the brand) should
   * pass "" so the mark is not announced twice to a screen reader. */
  alt?: string;
  priority?: boolean;
};

// THE VELVET VIKING MARK.
//
// The supplied artwork, byte-for-byte, at public/brand/velvet-viking-mark.png
// — the interlocking gold VV with the inverted triangle at its centre. It was
// installed by copying the file HQ supplied, not by tracing or redrawing it,
// and nothing here recolours, crops or re-proportions it.
//
// PROPORTIONS ARE THE ARTWORK'S, NOT A GUESS. The source is 1295x1214 with a
// transparent field; the opaque mark inside it occupies 1148x957, i.e. an
// aspect of 1.1996:1. `size` therefore sets WIDTH and the height follows from
// the intrinsic dimensions Next reads off the file — a square box would have
// letterboxed it, and forcing a height would have squashed it.
//
// SEPARATE FROM Crest. The circular crest is the full emblem: wordmark,
// "Valhalla Awaits" and "Earn Your Place" all baked into one piece of
// artwork, and it stays where a ceremonial emblem belongs. This is the MARK —
// the brand reduced to one shape — and it is what should appear wherever the
// primary Velvet Viking mark is intended, at sizes where the crest's own
// detail would collapse into an unreadable disc.
export default function Mark({
  size = 40,
  className = "",
  alt = "The Velvet Viking mark",
  priority = false,
}: MarkProps) {
  const width = typeof size === "number" ? `${size}px` : size;
  return (
    <span className={`inline-block ${className}`} style={{ width }}>
      <Image
        src={mark}
        alt={alt}
        priority={priority}
        sizes={typeof size === "number" ? `${size}px` : "220px"}
        className="h-auto w-full"
      />
    </span>
  );
}
