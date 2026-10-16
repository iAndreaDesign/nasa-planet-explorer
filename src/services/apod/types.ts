/** Fields of an APOD list entry used by the application (raw API shape, all optional). */
export interface ApodApiEntry {
  date?: unknown;
  title?: unknown;
  media_type?: unknown;
  alt?: unknown;
  url?: unknown;
  hdurl?: unknown;
}

/** Astronomy Picture of the Day shown on the home page (spec `astronomy-picture`). */
export interface ApodImage {
  title: string;
  /** Original image URL (`hdurl`): displayed and opened on click. */
  imageUrl: string;
  /** Plain-text alternative from `alt`, or `null` when the API provides none. */
  alt: string | null;
  date: string | null;
}
