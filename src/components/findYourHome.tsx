import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Home,
  BedDouble,
  Wallet,
  ArrowUpDown,
  SearchX,
} from "lucide-react";
import PropertyCard from "../components/propertyCard";
import { properties } from "../data/properties";
import FindUrHomeImg from "../assets/images/findurhomeimg.avif"

// Fields this page reads from each property. Adjust the names if your data differs.
type Property = {
  id: number | string;
  title?: string;
  type?: string;
  status?: string;
  price?: string | number;
  location?: string;
  beds?: number;
  [key: string]: unknown;
};

const all = properties as Property[];

// "$1,800 / month" -> 1800, 450000 -> 450000
const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  const n = parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const unique = (values: (string | undefined)[]) =>
  Array.from(new Set(values.filter(Boolean) as string[])).sort();

const SORTS = [
  { value: "newest", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "beds-desc", label: "Most bedrooms" },
];

const PRICE_OPTIONS = [
  { value: "", label: "Any price" },
  { value: "100000", label: "Up to 100,000" },
  { value: "250000", label: "Up to 250,000" },
  { value: "500000", label: "Up to 500,000" },
  { value: "1000000", label: "Up to 1,000,000" },
];

const BED_OPTIONS = [
  { value: "", label: "Any beds" },
  { value: "1", label: "1+ beds" },
  { value: "2", label: "2+ beds" },
  { value: "3", label: "3+ beds" },
  { value: "4", label: "4+ beds" },
  { value: "5", label: "5+ beds" },
];

const FindYourHome = () => {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters live in the URL so results can be shared and survive a refresh
  const query = params.get("q") ?? "";
  const type = params.get("type") ?? "";
  const status = params.get("status") ?? "";
  const maxPrice = params.get("price") ?? "";
  const minBeds = params.get("beds") ?? "";
  const sort = params.get("sort") ?? "newest";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const clearAll = () => setParams({}, { replace: true });

  const types = useMemo(() => unique(all.map((p) => p.type)), []);
  const statuses = useMemo(() => unique(all.map((p) => p.status)), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = all.filter((p) => {
      if (q) {
        const haystack = `${p.title ?? ""} ${p.location ?? ""} ${p.type ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (type && p.type !== type) return false;
      if (status && p.status !== status) return false;
      if (maxPrice && toNumber(p.price) > Number(maxPrice)) return false;
      if (minBeds && (p.beds ?? 0) < Number(minBeds)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (sort === "price-asc")
      sorted.sort((a, b) => toNumber(a.price) - toNumber(b.price));
    if (sort === "price-desc")
      sorted.sort((a, b) => toNumber(b.price) - toNumber(a.price));
    if (sort === "beds-desc")
      sorted.sort((a, b) => (b.beds ?? 0) - (a.beds ?? 0));
    return sorted;
  }, [query, type, status, maxPrice, minBeds, sort]);

  const activeCount = [type, status, maxPrice, minBeds].filter(Boolean).length;
  const hasFilters = activeCount > 0 || query !== "";

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  // Re-measure after results change so new cards animate in correctly
  useEffect(() => {
    AOS.refreshHard();
  }, [results.length]);

  // Lock body scroll while the mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  const selectClass =
    "w-full appearance-none rounded-lg border border-gray-300 bg-transparent py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";
  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

  const FilterFields = () => (
    <>
      <div className="relative">
        <Home size={18} className={iconClass} />
        <select
          aria-label="Property type"
          value={type}
          onChange={(e) => setParam("type", e.target.value)}
          className={selectClass}
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <MapPin size={18} className={iconClass} />
        <select
          aria-label="Listing status"
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
          className={selectClass}
        >
          <option value="">Buy or rent</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <Wallet size={18} className={iconClass} />
        <select
          aria-label="Maximum price"
          value={maxPrice}
          onChange={(e) => setParam("price", e.target.value)}
          className={selectClass}
        >
          {PRICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <BedDouble size={18} className={iconClass} />
        <select
          aria-label="Minimum bedrooms"
          value={minBeds}
          onChange={(e) => setParam("beds", e.target.value)}
          className={selectClass}
        >
          {BED_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <>
      {/* Page banner */}
      <section className="relative overflow-hidden bg-gray-900">
        <img
          src={FindUrHomeImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Find your home
          </h1>
          <p className="mt-3 max-w-xl text-white/80">
            Search by location, type and budget to discover homes that match
            how you want to live.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search size={18} className={iconClass} />
              <input
                type="search"
                value={query}
                onChange={(e) => setParam("q", e.target.value)}
                placeholder="Search by location, title or type"
                aria-label="Search properties"
                className="w-full rounded-full border-0 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Mobile filter button */}
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="relative flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 lg:hidden"
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-blue-600">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Desktop filters */}
        <div className="hidden grid-cols-4 gap-4 lg:grid">
          <FilterFields />
        </div>

        {/* Results bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 lg:mt-8">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{results.length}</span>{" "}
            {results.length === 1 ? "property" : "properties"} found
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-3 font-medium text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            )}
          </p>

          <div className="relative">
            <ArrowUpDown size={16} className={`${iconClass} left-3`} />
            <select
              aria-label="Sort properties"
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="appearance-none rounded-full border border-gray-300 bg-transparent py-2 pl-9 pr-4 text-sm text-gray-700 outline-none focus:border-blue-600"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((property, index) => (
              <div
                key={property.id}
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
              >
                <PropertyCard {...(property as any)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <SearchX size={30} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No homes match your search
            </h2>
            <p className="mt-2 max-w-sm text-sm text-gray-600">
              Try a different location or loosen some filters to see more
              properties.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          filtersOpen ? "visible" : "invisible"
        }`}
        aria-hidden={!filtersOpen}
      >
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            filtersOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-label="Filters"
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6 transition-transform duration-300 ${
            filtersOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-4">
            <FilterFields />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Show {results.length}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindYourHome;