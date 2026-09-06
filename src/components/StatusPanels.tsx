const FEATURED = [
  { label: "Marrakesh", query: "Marrakesh" },
  { label: "Lisbon", query: "Lisbon" },
  { label: "Kyoto", query: "Kyoto" },
  { label: "Reykjavík", query: "Reykjavik" },
  { label: "Cape Town", query: "Cape Town" },
  { label: "Oaxaca", query: "Oaxaca" },
];

type IdleProps = {
  onPick: (query: string) => void;
};

export function IdlePanel({ onPick }: IdleProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="eyebrow">Observatory</p>
      <h1 id="hero-title">
        A ring of light
        <br />
        around the weather.
      </h1>
      <p className="lede">
        Search any city for current temperature, humidity, wind, and a seven-day outlook. Or share
        your location. Nothing to sign in for.
      </p>
      <ul className="chips" aria-label="Featured cities">
        {FEATURED.map((city) => (
          <li key={city.query}>
            <button type="button" className="chip" onClick={() => onPick(city.query)}>
              {city.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LoadingPanel({ label }: { label: string }) {
  return (
    <section className="panel" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading weather for {label}</p>
      <div className="skel-hero">
        <div className="skel skel-kicker" />
        <div className="skel skel-temp" />
        <div className="skel skel-line" />
      </div>
      <div className="stats">
        {Array.from({ length: 4 }, (_, i) => (
          <div className="stat" key={i}>
            <div className="skel skel-stat" />
          </div>
        ))}
      </div>
      <div className="skel-row">
        {Array.from({ length: 7 }, (_, i) => (
          <div className="skel skel-hour" key={i} />
        ))}
      </div>
      <div className="skel-row days">
        {Array.from({ length: 7 }, (_, i) => (
          <div className="skel skel-day" key={i} />
        ))}
      </div>
    </section>
  );
}

export function NotFoundPanel({ query, onPick }: { query: string; onPick: (q: string) => void }) {
  return (
    <section className="panel message" role="status">
      <p className="eyebrow">No match</p>
      <h1>We couldn’t find “{query}”.</h1>
      <p className="lede">
        Open-Meteo has no city by that name. Check the spelling, or add a country —{" "}
        <em>Springfield, US</em> or <em>Paris, FR</em>.
      </p>
      <ul className="chips">
        {FEATURED.slice(0, 4).map((city) => (
          <li key={city.query}>
            <button type="button" className="chip" onClick={() => onPick(city.query)}>
              {city.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ErrorPanel({
  title,
  detail,
  onRetry,
}: {
  title: string;
  detail: string;
  onRetry: () => void;
}) {
  return (
    <section className="panel message" role="alert">
      <p className="eyebrow">Something stalled</p>
      <h1>{title}</h1>
      <p className="lede">{detail}</p>
      <button type="button" className="retry" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
}
