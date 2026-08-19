"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  Globe2,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { City } from "@/lib/types";
import { DestinationCard } from "../components/DestinationCard";

export default function ExplorePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");

  useEffect(() => {
    async function loadCities() {
      try {
        const response = await fetch("/api/cities/popular", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load destinations");
        }

        const data: City[] = await response.json();

        setCities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, []);

  const countries = useMemo(() => {
    const values = cities
      .map((city) => city.countryName)
      .filter(
        (value): value is string =>
          Boolean(value)
      );

    return [
      "All",
      ...Array.from(new Set(values)),
    ];
  }, [cities]);

  const filteredCities = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    return cities.filter((city) => {
      const matchesCountry =
        country === "All" ||
        city.countryName === country;

      const matchesQuery =
        !normalizedQuery ||
        city.name
          .toLowerCase()
          .includes(normalizedQuery) ||
        city.countryName
          ?.toLowerCase()
          .includes(normalizedQuery) ||
        city.description
          ?.toLowerCase()
          .includes(normalizedQuery);

      return matchesCountry && matchesQuery;
    });
  }, [cities, country, query]);

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-teal-100/60 blur-3xl" />

        <div className="travel-container relative py-14 sm:py-18 lg:py-22">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              <Compass size={15} />
              Destination explorer
            </div>

            <h1 className="text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
              Find somewhere
              <span className="text-teal-700"> worth going.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Explore destinations, discover attractions and follow the
              transport connections that turn one city into your next journey.
            </p>

            {/* SEARCH */}
            <div className="mt-8 max-w-3xl">
              <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-xl shadow-slate-900/5 transition focus-within:border-teal-300 focus-within:ring-4 focus-within:ring-teal-50">
                <Search
                  size={20}
                  className="shrink-0 text-slate-400"
                  aria-hidden="true"
                />

                <label
                  htmlFor="destination-search"
                  className="sr-only"
                >
                  Search destinations
                </label>

                <input
                  id="destination-search"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search cities, countries or places..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear destination search"
                    className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="travel-container py-10 sm:py-14">
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Explore destinations
              </h2>

              {!loading && (
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
                  {filteredCities.length}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Choose a destination and see where the travel graph takes you.
            </p>
          </div>

          {/* COUNTRY FILTER */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal
              size={16}
              className="shrink-0 text-slate-400"
              aria-hidden="true"
            />

            {countries.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCountry(item)}
                aria-pressed={country === item}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition ${
                  country === item
                    ? "bg-teal-700 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <DestinationSkeleton key={index} />
            ))}
          </div>
        )}

        {/* RESULTS */}
        {!loading &&
          filteredCities.length > 0 && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Globe2 size={14} />
                  Showing destinations from the graph
                </div>

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Clear search
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filteredCities.map((city) => (
                  <DestinationCard
                    key={city.id}
                    city={city}
                  />
                ))}
              </div>
            </>
          )}

        {/* EMPTY */}
        {!loading &&
          filteredCities.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <MapPin size={26} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No destinations found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try another city or country, or reset the current filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCountry("All");
                }}
                className="mt-6 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                Reset discovery
              </button>
            </div>
          )}
      </section>
    </main>
  );
}

function DestinationSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="h-48 animate-pulse bg-slate-200" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}