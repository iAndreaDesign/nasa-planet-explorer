interface ChevronIconProps {
  direction: 'left' | 'right';
  className?: string;
}

/** Decorative chevron for previous/next links. */
export function ChevronIcon({ direction, className }: ChevronIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={direction === 'left' ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
