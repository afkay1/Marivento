import { HOME_IMAGES } from "@/lib/data/hotel";
import Parallax from "./Parallax";
import TextReveal from "./TextReveal";
import SearchBar from "./SearchBar";

export default function CTA({ title = "Your terrace above the sea is waiting." }: { title?: string }) {
  return (
    <section aria-label="Book your stay">
      <Parallax image={HOME_IMAGES.sunset} className="min-h-[80svh] bg-deep" amount={8}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="wrap relative flex min-h-[80svh] flex-col items-center justify-center py-24 text-center text-chalk">
          <p className="eyebrow">Book direct for our best rate</p>
          <TextReveal text={title} className="display h1 mt-5 max-w-4xl" />
          <div className="mt-10 w-full max-w-5xl text-left">
            <SearchBar variant="hero" />
          </div>
        </div>
      </Parallax>
    </section>
  );
}
