import { notFound } from 'next/navigation';

/** Unknown paths inside a locale render the localised `[locale]/not-found.tsx`. */
export default function CatchAllPage() {
  notFound();
}
