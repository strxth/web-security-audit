'use client';

interface Props {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export default function ScoreGauge({
  score,
  size = 140,
  showLabel = true,
}: Props) {
  const pct = Math.round(score);
  // Push the circle out to make more room inside (0.86 is max without clipping stroke)
  const r = (size / 2) * 0.84;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f97316' : '#ef4444';
  const darkTrack = 'rgba(100,116,139,0.15)'; // Brighter track for both modes
  const label = pct >= 80 ? 'Secure' : pct >= 50 ? 'At Risk' : 'Vulnerable';

  return (
    <div className="flex select-none flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`Security score: ${pct}%`}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={darkTrack}
          strokeWidth={size * 0.12}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.12}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            transition: 'stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        {/* Percentage */}
        <text
          x={cx}
          y={showLabel ? cy + size * 0.02 : cy + size * 0.08}
          textAnchor="middle"
          fontSize={showLabel ? size * 0.22 : size * 0.26}
          fontWeight={800}
          fill={color}
          fontFamily="inherit"
        >
          {pct}%
        </text>
        {/* Label */}
        {showLabel && (
          <text
            x={cx}
            y={cy + size * 0.2}
            textAnchor="middle"
            fontSize={size * 0.1}
            fill="#94a3b8"
            fontFamily="inherit"
            fontWeight={600}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}
