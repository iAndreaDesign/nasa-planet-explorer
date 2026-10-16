/** Raw row of the Exoplanet Archive `pscomppars` query (all optional). */
export interface ExoplanetApiRow {
  pl_name?: unknown;
  hostname?: unknown;
  disc_year?: unknown;
  discoverymethod?: unknown;
  sy_dist?: unknown;
  pl_rade?: unknown;
  pl_bmasse?: unknown;
  pl_orbper?: unknown;
  pl_eqt?: unknown;
  pl_dens?: unknown;
}

/** Exoplanet as used by the UI (spec `exoplanets`). Missing values are `null`. */
export interface Exoplanet {
  /** URL slug from the name, unique within the selection (e.g. "gj-1214-b"). */
  slug: string;
  name: string;
  hostName: string | null;
  discoveryYear: number | null;
  discoveryMethod: string | null;
  /** parsecs */
  distance: number | null;
  /** Earth radii */
  radius: number | null;
  /** Earth masses */
  mass: number | null;
  /** days */
  orbitalPeriod: number | null;
  /** K */
  equilibriumTemperature: number | null;
  /** g/cm³ */
  density: number | null;
}
