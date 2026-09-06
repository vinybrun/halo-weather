import type { IconKind } from "../lib/weather";

type Props = {
  kind: IconKind;
  size?: number;
  className?: string;
};

export function WeatherIcon({ kind, size = 32, className }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    className,
    "aria-hidden": true as const,
  };

  switch (kind) {
    case "sun":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M16 4.5v2.2M16 25.3v2.2M4.5 16h2.2M25.3 16h2.2M7.6 7.6l1.6 1.6M22.8 22.8l1.6 1.6M7.6 24.4l1.6-1.6M22.8 9.2l1.6-1.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path
            d="M19.5 7.2A8.6 8.6 0 1 0 24.8 20 7 7 0 0 1 19.5 7.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "cloud-sun":
      return (
        <svg {...common}>
          <circle cx="20.5" cy="11" r="3.6" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M20.5 5.2v1.3M26.3 11h1.3M16.3 6.8l.9.9M25.6 15.3l.9.9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M9.2 22.6h11.4a3.8 3.8 0 0 0 .4-7.6 5.3 5.3 0 0 0-10.2 1.4 3.5 3.5 0 0 0-1.6 6.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "cloud-moon":
      return (
        <svg {...common}>
          <path
            d="M22 7.4A4.8 4.8 0 1 0 25.4 14 4 4 0 0 1 22 7.4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 22.6h11.4a3.8 3.8 0 0 0 .4-7.6 5.3 5.3 0 0 0-10.2 1.4 3.5 3.5 0 0 0-1.6 6.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path
            d="M8.6 21.8h14.2a4.4 4.4 0 0 0 .5-8.7 6.3 6.3 0 0 0-12.1 1.6A4.1 4.1 0 0 0 8.6 21.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path
            d="M8.4 15.2h15.2M6.8 19h18.4M9.6 22.8h12.8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path
            d="M9 16.4h13.2a3.8 3.8 0 0 0 .4-7.5 5.6 5.6 0 0 0-10.7 1.4A3.6 3.6 0 0 0 9 16.4Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 20.2v2.2M16 21v2.2M20 20.2v2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path
            d="M9 15.8h13.2a3.8 3.8 0 0 0 .4-7.5 5.6 5.6 0 0 0-10.7 1.4A3.6 3.6 0 0 0 9 15.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12 19.4 10.6 24M16.4 20.2 15 24.8M20.6 19.4 19.2 24"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path
            d="M9 15.6h13.2a3.8 3.8 0 0 0 .4-7.5 5.6 5.6 0 0 0-10.7 1.4A3.6 3.6 0 0 0 9 15.6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12.2 20.2h.01M16 22.4h.01M20 20.2h.01M12.2 24.4h.01M20 24.4h.01"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path
            d="M9 14.8h13.2a3.8 3.8 0 0 0 .4-7.5 5.6 5.6 0 0 0-10.7 1.4A3.6 3.6 0 0 0 9 14.8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M16.8 15.6 13 21.4h4.2L14.4 27"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function SearchGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function PinGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-6.1 7-11.2A7 7 0 1 0 5 9.8C5 14.9 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.8" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function HaloMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
    </svg>
  );
}
