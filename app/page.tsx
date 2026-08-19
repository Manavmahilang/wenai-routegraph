//app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Compass,
  MapPin,
  Route,
  Search,
  Sparkles,
} from "lucide-react";

import type { City } from "@/lib/types";
import { DestinationCard } from "./components/DestinationCard";


export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCities() {
      try {
        const response = await fetch("/api/cities/popular");

        if (!response.ok) {
          throw new Error("Failed to load destinations");
        }

        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#eaf6f4]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />

          <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="absolute right-1/3 top-1/2 h-56 w-56 rounded-full bg-white/60 blur-3xl" />
        </div>

        <div className="travel-container relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/75 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-teal-800 shadow-sm backdrop-blur">
              <Sparkles size={14} />
              Travel, connected
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[76px] lg:leading-[0.98]">
              Your next destination
              <br />
              <span className="text-teal-700">
                is closer than you think.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover cities, attractions and travel routes through
              an interconnected world of destinations.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Start exploring
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/routes"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700"
              >
                <Route size={17} />
                Find a route
              </Link>
            </div>
          </div>

          <div className="mt-16 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={<MapPin size={18} />}
              value="19"
              label="destinations"
            />

            <StatCard
              icon={<Route size={18} />}
              value="28+"
              label="travel connections"
            />

            <StatCard
              icon={<Compass size={18} />}
              value="32"
              label="attractions"
            />
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="travel-container py-16 sm:py-20 lg:py-24">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Popular destinations
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Start with a destination and follow the connections
              wherever they lead.
            </p>
          </div>

          <Link
            href="/explore"
            className="hidden items-center gap-2 text-sm font-bold text-teal-700 transition hover:text-teal-800 sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[310px] animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        ) : cities.length === 0 ? (
          <EmptyDestinations />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city, index) => (
              <DestinationCard
                key={city.id}
                city={city}
                featured={index === 0}
              />
            ))}
          </div>
        )}

        <Link
          href="/explore"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 sm:hidden"
        >
          View all destinations
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* GRAPH VALUE */}
      <section className="border-y border-slate-200 bg-white">
        <div className="travel-container py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              Built around connections
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Travel is more than a destination.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-500">
              RouteGraph maps the relationships between places so
              you can explore the journey, not just the endpoint.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Feature
              icon={<Search size={20} />}
              title="Discover"
              text="Search destinations and uncover what makes each place worth visiting."
            />

            <Feature
              icon={<Route size={20} />}
              title="Connect"
              text="See how destinations connect through flights, trains and other transport."
            />

            <Feature
              icon={<Compass size={20} />}
              title="Explore"
              text="Follow the graph to discover places and attractions beyond the obvious route."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-5 py-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
        {icon}
      </div>

      <div>
        <p className="font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
        {icon}
      </div>

      <h3 className="font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function EmptyDestinations() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center">
      <MapPin
        size={30}
        className="mx-auto text-slate-300"
      />

      <h3 className="mt-4 font-bold text-slate-900">
        No destinations available
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Connect to the graph database and load your destinations.
      </p>
    </div>
  );
}