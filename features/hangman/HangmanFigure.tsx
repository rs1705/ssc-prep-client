import { MAX_STRIKES } from "./game";

interface HangmanFigureProps {
  /** Number of wrong guesses so far (0..MAX_STRIKES). */
  strikes: number;
  className?: string;
}

// Drawn in the order the figure is "built" as strikes accumulate.
const BODY_PARTS: { key: string; node: React.ReactNode }[] = [
  { key: "head", node: <circle cx="86" cy="42" r="12" /> },
  { key: "torso", node: <line x1="86" y1="54" x2="86" y2="88" /> },
  { key: "left-arm", node: <line x1="86" y1="62" x2="68" y2="78" /> },
  { key: "right-arm", node: <line x1="86" y1="62" x2="104" y2="78" /> },
  { key: "left-leg", node: <line x1="86" y1="88" x2="70" y2="112" /> },
  { key: "right-leg", node: <line x1="86" y1="88" x2="102" y2="112" /> },
];

export function HangmanFigure({ strikes, className }: HangmanFigureProps) {
  return (
    <svg
      viewBox="0 0 130 130"
      role="img"
      aria-label={`${strikes} of ${MAX_STRIKES} strikes`}
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Gallows */}
      <g className="stroke-muted-foreground/60" strokeWidth="5">
        <line x1="14" y1="120" x2="70" y2="120" />
        <line x1="34" y1="120" x2="34" y2="14" />
        <line x1="34" y1="14" x2="86" y2="14" />
        <line x1="86" y1="14" x2="86" y2="30" />
      </g>

      {/* Figure */}
      <g className="stroke-rose-500" strokeWidth="5">
        {BODY_PARTS.map((part, index) => (
          <g
            key={part.key}
            className="transition-opacity duration-200 motion-reduce:transition-none"
            opacity={index < strikes ? 1 : 0}
          >
            {part.node}
          </g>
        ))}
      </g>
    </svg>
  );
}
