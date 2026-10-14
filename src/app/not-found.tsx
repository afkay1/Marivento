import Link from "next/link";
import Img from "@/components/Img";
import { HOME_IMAGES } from "@/lib/data/hotel";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-end bg-deep text-chalk">
      <Img image={HOME_IMAGES.night} className="absolute inset-0" decorative />
      <div className="absolute inset-0 bg-black/45" />
      <div className="wrap relative pb-24">
        <p className="eyebrow">404</p>
        <h1 className="display h1 mt-4 max-w-3xl">This path leads only to the sea.</h1>
        <p className="mt-4 max-w-md text-chalk/80">The page you were looking for doesn&apos;t exist. Let&apos;s get you back to the terrace.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-light">Back to home</Link>
          <Link href="/book" className="btn btn-ghost-light">Check availability</Link>
        </div>
      </div>
    </section>
  );
}
