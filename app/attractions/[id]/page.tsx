//app/attractions/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Compass,
  MapPin,
  Navigation,
  Network,
  Sparkles,
  Star,
} from "lucide-react";

import {
  getAttractionById,
  getCityConnections,
  getCityAttractions,
} from "@/lib/queries";

import { getDestinationImage } from "@/lib/destination-images";

interface AttractionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AttractionPage({
  params,
}: AttractionPageProps) {
  const { id } = await params;

  const result = await getAttractionById(id);

  if (!result) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <div className="travel-container flex min-h-[70vh] items-center justify-center py-20">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Compass size={25} />
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
              Attraction not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find this attraction in the RouteGraph
              database.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                <ArrowLeft size={16} />
                Back to destinations
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const {
    attraction,
    city,
  } = result;

  /*
   * These are all DB-backed.
   *
   * We only use the existing destination-image resolver
   * if the city itself does not have an image.
   */
  const cityImage =
    city.image || getDestinationImage(city.id);

  /*
   * Load related attractions and city connections in parallel.
   *
   * These are used for discovery/navigation around the
   * attraction rather than hard-coded recommendations.
   */
  const [cityAttractions, connections] =
    await Promise.all([
      getCityAttractions(city.id),
      getCityConnections(city.id),
    ]);

  const relatedAttractions =
    cityAttractions
      .filter(
        (item) => item.id !== attraction.id
      )
      .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          {attraction.image ? (
            <Image
              src={attraction.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-slate-950 to-slate-900" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/25" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        </div>

        <div className="travel-container relative py-8 sm:py-12 lg:py-16">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/50">
            <Link
              href="/explore"
              className="transition hover:text-white"
            >
              Explore
            </Link>

            <span>/</span>

            <Link
              href={`/cities/${city.id}`}
              className="transition hover:text-white"
            >
              {city.name}
            </Link>

            <span>/</span>

            <span className="text-white/80">
              {attraction.name}
            </span>
          </div>

          <div className="mt-16 max-w-4xl pb-10 sm:mt-24 lg:mt-28">
            {attraction.type && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-300 backdrop-blur-md">
                <Sparkles size={14} />
                {attraction.type}
              </div>
            )}

            <h1 className="text-5xl font-bold tracking-[-0.055em] sm:text-6xl lg:text-8xl">
              {attraction.name}
            </h1>

            <div className="mt-5 flex items-center gap-2 text-base text-white/70">
              <MapPin
                size={18}
                className="text-teal-300"
              />

              <Link
                href={`/cities/${city.id}`}
                className="transition hover:text-white"
              >
                {city.name}
                {city.countryName
                  ? `, ${city.countryName}`
                  : ""}
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {attraction.rating !== undefined && (
                <HeroStat
                  icon={<Star size={14} />}
                  value={attraction.rating.toFixed(1)}
                  label="rating"
                />
              )}

              {attraction.durationMinutes !==
                undefined && (
                <HeroStat
                  icon={<Clock3 size={14} />}
                  value={formatDuration(
                    attraction.durationMinutes
                  )}
                  label="visit duration"
                />
              )}

              {attraction.bestTime && (
                <HeroStat
                  icon={<Compass size={14} />}
                  value={attraction.bestTime}
                  label="best time"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="travel-container py-10 sm:py-14 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* MAIN */}
          <div className="space-y-6">
            {/* Description */}
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                <Compass size={14} />
                About this place
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {attraction.name}
              </h2>

              {attraction.description ? (
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                  {attraction.description}
                </p>
              ) : (
                <p className="mt-5 text-sm leading-7 text-slate-500">
                  No detailed description has been added
                  for this attraction yet.
                </p>
              )}

              {/* Tags */}
              {attraction.tags &&
                attraction.tags.length > 0 && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {attraction.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
            </section>

            {/* City context */}
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={cityImage}
                  alt={city.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-300">
                      Destination
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-white">
                      {city.name}
                    </h2>
                  </div>

                  <Link
                    href={`/cities/${city.id}`}
                    className="hidden items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:inline-flex"
                  >
                    View city
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-sm leading-7 text-slate-600">
                  {city.description ||
                    `Explore ${city.name}, its attractions and the destinations connected to it through the RouteGraph network.`}
                </p>

                <Link
                  href={`/cities/${city.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-800"
                >
                  Explore {city.name}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </section>

            {/* Related attractions */}
            {relatedAttractions.length > 0 && (
              <section>
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                    More nearby
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    More to explore in {city.name}
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedAttractions.map(
                    (item) => (
                      <RelatedAttraction
                        key={item.id}
                        attraction={item}
                      />
                    )
                  )}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Quick facts */}
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                Quick details
              </p>

              <div className="mt-5 divide-y divide-slate-100">
                {attraction.type && (
                  <DetailRow
                    label="Type"
                    value={attraction.type}
                  />
                )}

                {attraction.rating !==
                  undefined && (
                  <DetailRow
                    label="Rating"
                    value={`${attraction.rating.toFixed(
                      1
                    )} / 5`}
                  />
                )}

                {attraction.durationMinutes !==
                  undefined && (
                  <DetailRow
                    label="Typical visit"
                    value={formatDuration(
                      attraction.durationMinutes
                    )}
                  />
                )}

                {attraction.bestTime && (
                  <DetailRow
                    label="Best time"
                    value={attraction.bestTime}
                  />
                )}

                <DetailRow
                  label="City"
                  value={city.name}
                />

                {city.countryName && (
                  <DetailRow
                    label="Country"
                    value={city.countryName}
                  />
                )}
              </div>
            </section>

            {/* Navigation */}
            <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-teal-300">
                <Navigation size={19} />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-teal-300">
                Keep exploring
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Discover the rest of {city.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Explore the destination, attractions and
                transport connections around this place.
              </p>

              <Link
                href={`/cities/${city.id}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-teal-50"
              >
                Open destination
                <ArrowRight size={15} />
              </Link>
            </section>

            {/* Network */}
            {connections.length > 0 && (
              <section className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <Network size={18} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                  Travel network
                </p>

                <h3 className="mt-2 font-bold text-teal-950">
                  {connections.length} connected destinations
                </h3>

                <p className="mt-2 text-sm leading-6 text-teal-900/70">
                  See where you can continue travelling from{" "}
                  {city.name}.
                </p>

                <Link
                  href={`/network?city=${encodeURIComponent(
                    city.id
                  )}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-900"
                >
                  Open network
                  <ArrowRight size={15} />
                </Link>
              </section>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   RELATED ATTRACTION
============================================================ */

function RelatedAttraction({
  attraction,
}: {
  attraction: Awaited<
    ReturnType<typeof getCityAttractions>
  >[number];
}) {
  return (
    <Link
      href={`/attractions/${attraction.id}`}
      className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {attraction.image ? (
          <Image
            src={attraction.image}
            alt={attraction.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100 text-teal-300">
            <Compass size={28} />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          {attraction.type && (
            <span className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
              {attraction.type}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate font-bold text-slate-900 group-hover:text-teal-700">
            {attraction.name}
          </h3>

          <ArrowRight
            size={15}
            className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-700"
          />
        </div>

        {attraction.rating !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Star
              size={12}
              className="fill-current text-amber-500"
            />
            {attraction.rating.toFixed(1)}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ============================================================
   HERO STAT
============================================================ */

function HeroStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
      <span className="text-teal-300">
        {icon}
      </span>

      <div>
        <p className="text-sm font-bold text-white">
          {value}
        </p>

        <p className="text-[10px] font-medium uppercase tracking-wider text-white/45">
          {label}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   DETAIL ROW
============================================================ */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <span className="text-xs font-medium text-slate-400">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
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

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return remaining
    ? `${hours}h ${remaining}m`
    : `${hours}h`;
}