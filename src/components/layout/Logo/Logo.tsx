interface LogoProps {
  className?: string;
}

/** Decorative app mark (a ringed planet). The accessible name comes from the adjacent title. */
export function Logo({ className }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="logo-planet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3f7fd8" />
          <stop offset="100%" stopColor="#184c9a" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="#0c1320" stroke="rgb(255 255 255 / 12%)" />
      <circle cx="20" cy="20" r="10" fill="url(#logo-planet)" />
      <ellipse
        cx="20"
        cy="20"
        rx="16"
        ry="5"
        fill="none"
        stroke="#c2414c"
        strokeWidth="2"
        transform="rotate(-20 20 20)"
      />
    </svg>
  );
}
