import type { UnitSystem } from "../types";

type Props = {
  unit: UnitSystem;
  onChange: (unit: UnitSystem) => void;
};

export function UnitToggle({ unit, onChange }: Props) {
  return (
    <div className="units" role="group" aria-label="Temperature unit">
      <button
        type="button"
        className={unit === "celsius" ? "unit is-on" : "unit"}
        aria-pressed={unit === "celsius"}
        onClick={() => onChange("celsius")}
      >
        °C
      </button>
      <button
        type="button"
        className={unit === "fahrenheit" ? "unit is-on" : "unit"}
        aria-pressed={unit === "fahrenheit"}
        onClick={() => onChange("fahrenheit")}
      >
        °F
      </button>
    </div>
  );
}
