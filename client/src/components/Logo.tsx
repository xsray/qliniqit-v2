/**
 * Qliniqit logo — redesigned as a single unified letterform.
 *
 * Concept: The letter Q is drawn as two arc halves with a horizontal gap
 * at the 3 o'clock and 9 o'clock positions. The ECG heartbeat trace threads
 * horizontally through both gaps — entering from the left, spiking inside,
 * and continuing as the Q's tail to the right. The result is one cohesive
 * mark, not a circle with something pasted on it.
 *
 * All paths share one color (brand indigo on light, white on dark).
 * No container badge. Stroke hierarchy: Q arcs 4px > ECG trace 2.6px.
 */

let _uid = 0;

export interface LogoProps {
  /** Rendered height in px. Width scales proportionally. Default 32. */
  size?: number;
  /** Show "Qliniqit" wordmark. Default false. */
  full?: boolean;
  /** White paths + white wordmark (for dark backgrounds). Default false. */
  white?: boolean;
  className?: string;
}

// Q arc + ECG are drawn in a 56 × 44 coordinate space.
// Gap at 5 o'clock (~50° from east) so the tail exits lower — reads as Q, not magnifying glass.
const CX = 21;
const CY = 19;
const R  = 14;   // Q radius

function toRad(d: number) { return (d * Math.PI) / 180; }
function fromRad(r: number) { return (r * 180) / Math.PI; }

// Gap at 62° from east ± DELTA — steeper angle reads as Q tail, not magnifying glass
const GAP_ANG = 62;          // degrees from east — lower-right, steep enough to look like Q
const HALF_GAP_DEG = 7;      // half-gap width in degrees

const gapUpper = toRad(GAP_ANG - HALF_GAP_DEG); // 43°
const gapLower = toRad(GAP_ANG + HALF_GAP_DEG); // 57°

// Upper gap edge (closer to 3 o'clock)
const GU = { x: p(CX + R * Math.cos(gapUpper)), y: p(CY + R * Math.sin(gapUpper)) };
// Lower gap edge (closer to 6 o'clock)
const GL = { x: p(CX + R * Math.cos(gapLower)), y: p(CY + R * Math.sin(gapLower)) };

// ONE arc: from GL clockwise ~306° all the way around back to GU (large-arc=1, sweep=1)
const qArc = `M ${GL.x} ${GL.y} A ${R} ${R} 0 1 1 ${GU.x} ${GU.y}`;

// ECG trace: horizontal inside Q, then slopes down to exit at the gap (5 o'clock),
// then continues as the diagonal Q tail.
// The slope from baseline to exit naturally mimics the ECG's terminal deflection.
const ECG_Y  = CY;
const ECG_X0 = CX - R + 3;   // start inside left rim
const PRE_X  = CX - 4;
const R_X    = CX - 1.5;
const R_Y    = CY - 9.5;      // R peak (up)
const S_X    = CX + 1.5;
const S_Y    = CY + 7;        // S trough (down)
const POST_X = CX + 5;        // return to baseline

// Gap midpoint — ECG exits here through the arc gap
const GAP_MID_X = p(CX + R * Math.cos(toRad(GAP_ANG)));
const GAP_MID_Y = p(CY + R * Math.sin(toRad(GAP_ANG)));

// Tail continues outward along the gap angle
const TAIL_LEN = 5.5;  // short stub — Q tail, not magnifying glass handle
const TAIL_END_X = p(GAP_MID_X + TAIL_LEN * Math.cos(toRad(GAP_ANG)));
const TAIL_END_Y = p(GAP_MID_Y + TAIL_LEN * Math.sin(toRad(GAP_ANG)));

const ecgPath = [
  `M ${ECG_X0},${ECG_Y}`,
  `H ${PRE_X}`,
  `L ${R_X},${R_Y}`,
  `L ${S_X},${S_Y}`,
  `L ${POST_X},${ECG_Y}`,
  `L ${GAP_MID_X},${GAP_MID_Y}`,  // slope down to 5 o'clock exit
  `L ${TAIL_END_X},${TAIL_END_Y}`, // continue as Q tail
].join(" ");

// ─────────────────────────────────────────────────────────────────

export default function Logo({
  size = 32,
  full = false,
  white = false,
  className = "",
}: LogoProps) {
  const id = `ql${++_uid}`;

  // Viewport: 56 wide × 44 tall
  const VW = 56;
  const VH = 44;
  const displayH = size;
  const displayW = Math.round(size * (VW / VH));

  const color = white ? "white" : "oklch(0.47 0.22 262)";
  const gradId = `${id}wm`;

  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={{ lineHeight: 1 }}
    >
      {/* ── Icon mark ──────────────────────────────────────────────── */}
      <svg
        width={displayW}
        height={displayH}
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0, display: "block" }}
      >
        {/* Q arc (~346°, gap on right side only) */}
        <path
          d={qArc}
          stroke={color}
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* ECG heartbeat trace (threads through Q, tail extends right) */}
        <path
          d={ecgPath}
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* ── Wordmark ───────────────────────────────────────────────── */}
      {full && (
        <>
          {!white && (
            <svg width={0} height={0} style={{ position: "absolute" }}>
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="oklch(0.47 0.22 262)" />
                  <stop offset="100%" stopColor="oklch(0.54 0.24 290)" />
                </linearGradient>
              </defs>
            </svg>
          )}
          <span
            style={{
              fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
              fontWeight: 800,
              fontSize: Math.round(size * 0.62),
              letterSpacing: "-0.025em",
              lineHeight: 1,
              ...(white
                ? { color: "white" }
                : {
                    background: "linear-gradient(135deg, oklch(0.47 0.22 262), oklch(0.54 0.24 290))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }),
            }}
          >
            Qliniqit
          </span>
        </>
      )}
    </span>
  );
}

/** Round to 2 dp for clean SVG output */
function p(n: number) {
  return Math.round(n * 100) / 100;
}
