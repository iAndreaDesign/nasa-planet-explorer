/** Raw Solar System OpenData body (only the fields used by the application, all optional). */
export interface SolarSystemApiBody {
  id?: unknown;
  name?: unknown;
  englishName?: unknown;
  bodyType?: unknown;
  moons?: unknown;
  mass?: unknown;
  meanRadius?: unknown;
  density?: unknown;
  gravity?: unknown;
  escape?: unknown;
  axialTilt?: unknown;
  semimajorAxis?: unknown;
  sideralOrbit?: unknown;
  sideralRotation?: unknown;
  avgTemp?: unknown;
}

/** `massValue × 10^massExponent` kg. */
export interface ScientificValue {
  value: number;
  exponent: number;
}

/** Reference to a moon listed in a planet's `moons` array. */
export interface MoonRef {
  name: string;
  /** API body id extracted from `rel`; `null` when `rel` is missing or not a Solar System API URL. */
  id: string | null;
}

/** Planet as used by the UI (spec `solar-system-planets`). Missing values are `null`. */
export interface Planet {
  /** API id (French, e.g. "terre"). */
  id: string;
  /** URL slug from the English name (e.g. "earth"). */
  slug: string;
  name: string;
  /** 1-based position when ordered by distance from the Sun. */
  position: number;
  bodyType: string | null;
  moons: MoonRef[];
  /** kg */
  mass: ScientificValue | null;
  /** km */
  meanRadius: number | null;
  /** g/cm³ */
  density: number | null;
  /** m/s² */
  gravity: number | null;
  /** m/s */
  escape: number | null;
  /** degrees */
  axialTilt: number | null;
  /** km */
  semimajorAxis: number | null;
  /** days */
  sideralOrbit: number | null;
  /** hours */
  sideralRotation: number | null;
  /** K */
  avgTemp: number | null;
}

/** Moon data shown in the moons section (spec `planet-moons`). Missing values are `null`. */
export interface Moon {
  id: string;
  name: string;
  /** km */
  meanRadius: number | null;
  /** kg */
  mass: ScientificValue | null;
  /** g/cm³ */
  density: number | null;
  /** m/s² */
  gravity: number | null;
}
