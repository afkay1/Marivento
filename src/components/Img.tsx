import Image from "next/image";
import type { Img as ImgT } from "@/lib/types";

interface Props {
  image: ImgT;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
}

/** Responsive cover image. The wrapper sets size and aspect ratio. */
export default function Img({ image, className = "", imgClassName = "", sizes = "100vw", priority = false, decorative = false }: Props) {
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} overflow-hidden bg-sand ${className}`}>
      <Image
        src={image.src}
        alt={decorative ? "" : image.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}
