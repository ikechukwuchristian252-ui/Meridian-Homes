import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Phone } from "lucide-react";

export default function PropertyCard({
  images = [],
  status = "For Sale",
  type = "Semi Detached",
  location,
  price,
  title,
  agent,
}: {
  images?: string[];
  status?: string;
  type?: string;
  location?: string;
  price?: string | number;
  title?: string;
  agent?: {
    photo?: string;
    name?: string;
    whatsapp?: string;
    phone?: string;
  };
}) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <article className="w-full max-w-sm bg-background text-foreground">
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-foreground/10">
        {images.length > 0 && (
          <img
            src={images[index]}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-amber-500 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {status}
          </span>
          <span className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-primary backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {type}
          </span>
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Location */}
        <p className="absolute bottom-3 left-4 text-lg font-semibold text-white drop-shadow">
          {location}
        </p>
      </div>

      {/* Details */}
      <div className="mt-3">
        <p className="text-xl font-medium">{price}</p>
        <h3 className="mt-1 text-base text-foreground/80">{title}</h3>
      </div>

      <hr className="my-3 border-foreground/10" />

      {/* Agent */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={agent?.photo}
            alt={agent?.name}
            className="h-14 w-14 rounded-full bg-foreground/10 object-cover"
          />
          <span className="font-medium">{agent?.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${agent?.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white shadow hover:brightness-95"
          >
            <MessageCircle size={22} />
          </a>
          <a
            href={`tel:${agent?.phone}`}
            aria-label="Call agent"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow hover:bg-accent"
          >
            <Phone size={20} />
          </a>
        </div>
      </div>
    </article>
  );
}

/* ---------- Example usage ----------

<PropertyCard
  images={["/images/house1.jpg", "/images/house2.jpg"]}
  status="For Sale"
  type="Semi Detached"
  location="Lekki"
  price="₦165,000,000"
  title="4 Bedroom Semi-Detached Duplex in Lekki"
  agent={{
    name: "Esther",
    photo: "/images/esther.jpg",
    whatsapp: "2348012345678",   // country code, no + or spaces
    phone: "+2348012345678",
  }}
/>

*/