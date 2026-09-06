import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { searchPlaces } from "../api/openMeteo";
import { placeSubtitle } from "../lib/format";
import type { Place } from "../types";
import { PinGlyph, SearchGlyph } from "./WeatherIcon";

const DEBOUNCE_MS = 260;

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmitQuery: (value: string) => void;
  onSelectPlace: (place: Place) => void;
  onUseLocation: () => void;
  busy?: boolean;
};

export function SearchBar({
  query,
  onQueryChange,
  onSubmitQuery,
  onSelectPlace,
  onUseLocation,
  busy,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hits, setHits] = useState<Place[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setSearching(false);
      setOpen(false);
      setActive(-1);
      return;
    }

    const ac = new AbortController();
    setSearching(true);
    setOpen(true);
    const timer = window.setTimeout(() => {
      void searchPlaces(q, ac.signal)
        .then((results) => {
          if (ac.signal.aborted) return;
          setHits(results);
          setSearching(false);
          setActive(results.length ? 0 : -1);
          setOpen(true);
        })
        .catch(() => {
          if (ac.signal.aborted) return;
          setHits([]);
          setSearching(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [query]);

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  function choose(place: Place) {
    onQueryChange(place.name);
    setOpen(false);
    onSelectPlace(place);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (open && active >= 0 && hits[active]) {
      choose(hits[active]);
      return;
    }
    setOpen(false);
    onSubmitQuery(query);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!open || hits.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i <= 0 ? hits.length - 1 : i - 1));
    }
  }

  const trimmed = query.trim();
  const showList = open && trimmed.length >= 2;

  return (
    <div className={showList ? "seek is-open" : "seek"} ref={rootRef}>
      <form className="seek-form" role="search" autoComplete="off" onSubmit={submit}>
        <label className="sr-only" htmlFor="city">
          Search city
        </label>
        <span className="seek-icon">
          <SearchGlyph />
        </span>
        <input
          ref={inputRef}
          id="city"
          name="city"
          type="search"
          placeholder="Search a city — try Kyoto or Lisbon"
          value={query}
          maxLength={80}
          spellCheck={false}
          disabled={busy}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showList}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={() => {
            if (trimmed.length >= 2) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        <button type="submit" className="seek-go" disabled={busy}>
          Look up
        </button>
        <button type="button" className="seek-geo" onClick={onUseLocation} disabled={busy}>
          <PinGlyph />
          <span>Near me</span>
        </button>
      </form>
      {showList ? (
        <div className="suggest" id={listId} role="listbox" aria-label="Matching cities">
          {searching ? (
            <div className="suggest-status">Searching…</div>
          ) : hits.length === 0 ? (
            <div className="suggest-status">No cities match “{trimmed}”</div>
          ) : (
            hits.map((hit, i) => (
              <button
                key={`${hit.id}-${hit.latitude}-${hit.longitude}`}
                type="button"
                role="option"
                id={`${listId}-${i}`}
                className={i === active ? "suggest-item is-active" : "suggest-item"}
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(hit)}
              >
                <span className="suggest-name">{hit.name}</span>
                <span className="suggest-meta">{placeSubtitle(hit)}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
