//app/cities/[id]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Clock3,
  MapPin,
  Navigation,
  Route,
  Sparkles,
  Star,
} from "lucide-react";

import type {
  Attraction,
  City,
  CityConnection,
} from "@/lib/types";

import { TravelGraph } from "@/app/components/TravelGraph";
import { getDestinationImage } from "@/lib/destination-images";

interface CityPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface CityResponse {
  city: City;
  attractions: Attraction[];
  connections: CityConnection[];
}

export default function CityPage({
  params,
}: CityPageProps) {
  const [cityId, setCityId] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>(
    []
  );
  const [connections, setConnections] = useState<
    CityConnection[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Resolve the dynamic route parameter.
   */
  useEffect(() => {
    let cancelled = false;

    params.then(({ id }) => {
      if (!cancelled) {
        setCityId(id);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [params]);

  /*
   * Load the complete city payload.
   *
   * This remains backward compatible with:
   *
   * GET /api/cities/[id]
   *
   * No new client-side city APIs are introduced.
   */
  useEffect(() => {
    if (!cityId) return;

    const controller = new AbortController();

    async function loadCity() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/cities/${encodeURIComponent(cityId)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Destination not found."
              : "Unable to load destination."
          );
        }

        const data =
          (await response.json()) as CityResponse;

        setCity(data.city ?? null);
        setAttractions(data.attractions ?? []);
        setConnections(data.connections ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        console.error("City page failed:", err);

        setCity(null);
        setAttractions([]);
        setConnections([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load destination."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCity();

    return () => {
      controller.abort();
    };
  }, [cityId]);

  if (loading) {
    return <CitySkeleton />;
  }

  if (error || !city) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <div className="travel-container py-20 sm:py-28">
          <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <MapPin size={24} />
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
              {error || "Destination not found"}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              We couldn't load this destination from the
              RouteGraph database.
            </p>

            <Link
              href="/explore"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              <ArrowLeft size={16} />
              Back to explore
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Prefer the image stored on the City node.
   *
   * getDestinationImage() is only a compatibility fallback
   * for existing cities that don't yet have an image property.
   */
  const cityImage =
    city.image || getDestinationImage(city.id);

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative h-[470px] overflow-hidden sm:h-[540px] lg:h-[590px]">
        <Image
          src={cityImage}
          alt={`${city.name}, ${city.countryName ?? ""}`}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-1000"
        />

        {/* Layered cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="travel-container relative flex h-full flex-col justify-between py-7 sm:py-8">
          {/* Back */}
          <Link
            href="/explore"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-white/25 hover:bg-black/40"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            Explore destinations
          </Link>

          {/* Hero content */}
          <div className="max-w-4xl pb-5 sm:pb-7">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {city.countryName && (
                <span className="rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-xl">
                  {city.countryName}
                </span>
              )}

              {city.regionName && (
                <span className="rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-xl">
                  {city.regionName}
                </span>
              )}
            </div>

            <h1 className="text-5xl font-bold tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              {city.name}
            </h1>

            <div className="mt-5 flex max-w-3xl items-start gap-2.5 text-sm leading-6 text-white/75 sm:text-base">
              <MapPin
                size={18}
                className="mt-1 shrink-0 text-teal-300"
              />

              <p>
                {city.description ||
                  `Explore ${city.name} and its connected destinations.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OVERVIEW
      ====================================================== */}
      <section className="travel-container relative z-10 -mt-8 pb-14 sm:-mt-10 sm:pb-20">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-5">
            {/* =================================================
                ATTRACTIONS
            ================================================== */}
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-teal-700">
                      <Compass size={14} />
                      Discover
                    </div>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                      Things to experience
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Explore attractions and experiences connected
                      directly to {city.name}.
                    </p>
                  </div>

                  <Link
                    href={`/cities/${city.id}/attractions`}
                    className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                  >
                    View all
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>

              {attractions.length === 0 ? (
                <EmptyAttractions
                  cityName={city.name}
                />
              ) : (
                <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
                  {attractions.slice(0, 6).map((attraction) => (
                    <AttractionPreview
                      key={attraction.id}
                      attraction={attraction}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* =================================================
                NETWORK
            ================================================== */}
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
              <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-teal-700">
                      <Navigation size={14} />
                      Connected world
                    </div>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                      {city.name} network
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Explore how this destination connects to the
                      wider RouteGraph network.
                    </p>
                  </div>

                  <Link
                    href={`/network?city=${encodeURIComponent(city.id)}`}
                    className="group inline-flex w-fit shrink-0 items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-800"
                  >
                    Open network
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>

              <div className="p-2 sm:p-4">
                <TravelGraph
                  cityId={city.id}
                  cityName={city.name}
                />
              </div>
            </section>

            {/* =================================================
                CONNECTIONS
            ================================================== */}
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.17em] text-teal-700">
                      Connected destinations
                    </div>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                      Where can you go?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Real transportation relationships connected to{" "}
                      {city.name}.
                    </p>
                  </div>

                  {connections.length > 0 && (
                    <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 sm:inline-flex">
                      {connections.length} connections
                    </span>
                  )}
                </div>
              </div>

              {connections.length === 0 ? (
                <EmptyConnections
                  cityName={city.name}
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {connections.map((connection) => (
                    <ConnectionRow
                      key={`${connection.city.id}-${connection.mode}-${connection.durationMinutes}`}
                      connection={connection}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ===================================================
              SIDEBAR
          ==================================================== */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Route CTA */}
            <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10">
              <div className="relative">
                <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-teal-500/15 blur-3xl" />

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-teal-300">
                    <Route size={20} />
                  </div>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-teal-300">
                    Route planning
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    Go somewhere from {city.name}.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Compare direct and multi-hop journeys through
                    the RouteGraph network.
                  </p>

                  <Link
                    href={`/routes?from=${encodeURIComponent(city.id)}`}
                    className="group mt-7 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-teal-50"
                  >
                    Find a route

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Navigation size={18} />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {formatCoordinate(city.latitude)}
                    {" · "}
                    {formatCoordinate(city.longitude)}
                  </p>
                </div>
              </div>

              {city.countryName && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Country
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {city.countryName}
                  </p>
                </div>
              )}

              {city.regionName && (
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Region
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {city.regionName}
                  </p>
                </div>
              )}
            </div>

            {/* Data provenance */}
            <div className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                <Sparkles size={18} />
              </div>

              <h3 className="mt-4 font-bold text-teal-950">
                Graph-native destination
              </h3>

              <p className="mt-2 text-sm leading-6 text-teal-900/70">
                Destination information, attractions and transport
                connections are loaded from the RouteGraph graph
                database.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   ATTRACTION PREVIEW
============================================================ */

function AttractionPreview({
  attraction,
}: {
  attraction: Attraction;
}) {
  return (
    <Link
      href={`/attractions/${attraction.id}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/30 hover:shadow-lg hover:shadow-slate-900/5"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {attraction.image ? (
            <Image
              src={attraction.image}
              alt=""
              fill
              sizes="56px"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-teal-300">
              <Compass size={20} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-bold text-slate-900 transition group-hover:text-teal-700">
              {attraction.name}
            </h3>

            <ArrowRight
              size={15}
              className="mt-0.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700"
            />
          </div>

          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
            {attraction.type}
          </p>

          {attraction.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
              {attraction.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {attraction.rating !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <Star
                  size={11}
                  className="fill-current text-amber-500"
                />
                {attraction.rating.toFixed(1)}
              </span>
            )}

            {attraction.durationMinutes !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <Clock3 size={11} />
                {formatDuration(
                  attraction.durationMinutes
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================
   CONNECTION ROW
============================================================ */

function ConnectionRow({
  connection,
}: {
  connection: CityConnection;
}) {
  const destination = connection.city;

  const image =
    destination.image ||
    getDestinationImage(destination.id);

  return (
    <Link
      href={`/cities/${destination.id}`}
      className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-7"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={image}
          alt={destination.name}
          fill
          sizes="56px"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-bold text-slate-900 transition group-hover:text-teal-700">
            {destination.name}
          </h3>

          {destination.countryName && (
            <span className="hidden truncate text-xs text-slate-400 sm:inline">
              {destination.countryName}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span className="font-bold text-teal-700">
            {connection.mode}
          </span>

          <span aria-hidden="true">·</span>

          <span>
            {formatDuration(
              connection.durationMinutes
            )}
          </span>

          <span aria-hidden="true">·</span>

          <span>
            {formatDistance(connection.distanceKm)}
          </span>

          {connection.frequency && (
            <>
              <span aria-hidden="true">·</span>
              <span>{connection.frequency}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-300 transition group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700">
        <ArrowRight size={15} />
      </div>
    </Link>
  );
}

/* ============================================================
   EMPTY STATES
============================================================ */

function EmptyAttractions({
  cityName,
}: {
  cityName: string;
}) {
  return (
    <div className="px-6 py-16 text-center sm:px-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <Compass size={21} />
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        No attractions yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        There are currently no attraction records connected
        to {cityName} in the graph.
      </p>
    </div>
  );
}

function EmptyConnections({
  cityName,
}: {
  cityName: string;
}) {
  return (
    <div className="px-6 py-16 text-center sm:px-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Route size={21} />
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        No connections found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        The graph currently has no transport connections
        recorded for {cityName}.
      </p>
    </div>
  );
}

/* ============================================================
   FORMATTING
============================================================ */

function formatDuration(minutes: number) {
  if (!Number.isFinite(minutes) || minutes < 0) {
    return "—";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (!hours) {
    return `${mins}m`;
  }

  return mins
    ? `${hours}h ${mins}m`
    : `${hours}h`;
}

function formatDistance(distanceKm: number) {
  if (!Number.isFinite(distanceKm)) {
    return "—";
  }

  if (distanceKm < 1000) {
    return `${Math.round(distanceKm)} km`;
  }

  return `${(distanceKm / 1000).toFixed(1)}k km`;
}

function formatCoordinate(value: number) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(2)}°`;
}

/* ============================================================
   LOADING STATE
============================================================ */

function CitySkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="h-[470px] animate-pulse bg-slate-300 sm:h-[540px] lg:h-[590px]" />

      <div className="travel-container relative -mt-8 pb-16 sm:-mt-10">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-5">
            <div className="h-[330px] animate-pulse rounded-[2rem] bg-white shadow-xl" />

            <div className="h-[600px] animate-pulse rounded-[2rem] bg-white shadow-xl" />

            <div className="h-[400px] animate-pulse rounded-[2rem] bg-white shadow-sm" />
          </div>

          <div className="space-y-5">
            <div className="h-64 animate-pulse rounded-[2rem] bg-slate-900" />

            <div className="h-48 animate-pulse rounded-[2rem] bg-white" />

            <div className="h-48 animate-pulse rounded-[2rem] bg-teal-50" />
          </div>
        </div>
      </div>
    </main>
  );
}