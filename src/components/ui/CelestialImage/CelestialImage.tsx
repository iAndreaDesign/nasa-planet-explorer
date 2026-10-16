import Image, { type StaticImageData } from 'next/image';

interface CelestialImageProps {
  image: StaticImageData;
  /** Empty by default: images are illustrative and the body's name is always shown next to them. */
  alt?: string;
  /** Rendered width hint for responsive loading, e.g. "(min-width: 64rem) 10rem, 8rem". */
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function CelestialImage({ image, alt = '', sizes, priority = false, className }: CelestialImageProps) {
  return <Image src={image} alt={alt} sizes={sizes} priority={priority} className={className} />;
}
