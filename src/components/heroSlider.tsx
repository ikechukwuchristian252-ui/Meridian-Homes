import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  ArrowRight,
} from "lucide-react";
import HeroImg1 from "../assets/images/heroImg1.avif";
import HeroImg2 from "../assets/images/heroImg2.avif";
import HeroImg3 from "../assets/images/heroImg3.avif";
import HeroImg4 from "../assets/images/heroImg4.avif";

type Home = {
  id: number;
  title: string;
  type: "House" | "Apartment" | "Villa" | "Duplex" | "Land";
  status: "For Sale" | "For Rent";
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
};

// Replace with your real listings (or fetch them from your API)
const homes: Home[] = [
  {
    id: 1,
    title: "Modern Family House",
    type: "House",
    status: "For Sale",
    price: "$450,000",
    location: "Lekki Phase 1, Lagos",
    beds: 4,
    baths: 3,
    area: "320 m²",
    image: HeroImg1,
  },
  {
    id: 2,
    title: "Luxury City Apartment",
    type: "Apartment",
    status: "For Rent",
    price: "$1,800 / month",
    location: "Victoria Island, Lagos",
    beds: 2,
    baths: 2,
    area: "140 m²",
    image: HeroImg2,
  },
  {
    id: 3,
    title: "Beachfront Villa",
    type: "Villa",
    status: "For Sale",
    price: "$1,200,000",
    location: "Ikoyi, Lagos",
    beds: 6,
    baths: 5,
    area: "650 m²",
    image: HeroImg3,
  },
  {
    id: 4,
    title: "Contemporary Duplex",
    type: "Duplex",
    status: "For Sale",
    price: "$320,000",
    location: "Ibadan, Oyo State",
    beds: 5,
    baths: 4,
    area: "400 m²",
    image: HeroImg4,
  },
];

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 50;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = homes.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );

  // Autoplay
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, next, current]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff < 0 ? next() : prev();
    }
    touchStartX.current = null;
    setPaused(false);
  };

  return (
    <section
      className="relative h-[75vh] min-h-158 w-full overflow-hidden bg-gray-900 md:h-[85vh]"
      aria-roledescription="carousel"
      aria-label="Featured homes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {homes.map((home, index) => {
        const active = index === current;
        return (
          <div
            key={home.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${total}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              active ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <img
              src={home.image}
              alt={home.title}
              loading={index === 0 ? "eager" : "lazy"}
              className={`h-full w-full object-cover transition-transform duration-6000 ease-linear ${
                active ? "scale-110" : "scale-100"
              }`}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 sm:pb-28 lg:px-8">
                <div
                  className={`max-w-2xl text-white transition-all duration-700 ${
                    active
                      ? "translate-y-0 opacity-100 delay-200"
                      : "translate-y-6 opacity-0"
                  }`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                      {home.type}
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
                      {home.status}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                    {home.title}
                  </h2>

                  <p className="mt-3 flex items-center gap-2 text-sm text-white/90 sm:text-base">
                    <MapPin size={18} className="shrink-0" />
                    {home.location}
                  </p>

                  <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/90">
                    <li className="flex items-center gap-2">
                      <BedDouble size={18} /> {home.beds} Beds
                    </li>
                    <li className="flex items-center gap-2">
                      <Bath size={18} /> {home.baths} Baths
                    </li>
                    <li className="flex items-center gap-2">
                      <Ruler size={18} /> {home.area}
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <p className="text-2xl font-bold sm:text-3xl">
                      {home.price}
                    </p>
                    <Link
                      to={`/properties/${home.id}`}
                      tabIndex={active ? 0 : -1}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-blue-600 hover:text-white"
                    >
                      Check it out
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrows (hidden on small screens, swipe instead) */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white hover:text-gray-900 md:flex"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white hover:text-gray-900 md:flex"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2">
        {homes.map((home, index) => (
          <button
            key={home.id}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
