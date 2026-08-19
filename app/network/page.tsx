//app/network/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Globe2,
  Network,
  Route,
  Search,
  Sparkles,
  Waypoints,
} from "lucide-react";

import type { City } from "@/lib/types";
import { CitySearch } from "../components/CitySearch";
import { TravelGraph } from "../components/TravelGraph";


export default function NetworkPage() {
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [selectedName, setSelectedName] = useState("Delhi");
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    async function loadCities() {
      try {
        const response = await fetch("/api/cities/popular", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load destinations");
        }

        const data: City[] = await response.json();
        setCities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCities(false);
      }
    }

    loadCities();
  }, []);

  function selectCity(city: City) {
    setSelectedCity(city.id);
    setSelectedName(city.name);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute -bottom-48 left-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.06]">
            <svg
              className="h-full w-full"
              viewBox="0 0 800 500"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M40 380L180 210L310 300L450 120L600 240L760 80"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M90 100L240 190L390 80L520 310L700 180"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="180" cy="210" r="5" fill="currentColor" />
              <circle cx="310" cy="300" r="5" fill="currentColor" />
              <circle cx="450" cy="120" r="5" fill="currentColor" />
              <circle cx="600" cy="240" r="5" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="travel-container relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-300 backdrop-blur">
              <Network size={15} />
              Graph explorer
            </div>

            <h1 className="text-4xl font-bold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              See travel as a
              <span className="text-teal-300"> connected world.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore destinations as nodes and transportation as
              relationships. Select a city to reveal the network around it.
            </p>

            <div className="mt-8 max-w-2xl">
              <CitySearch
                placeholder="Search any destination..."
                onSelect={selectCity}
              />
            </div>
          </div>
        </div>
      </section>

      {/* GRAPH */}
      <section className="travel-container py-10 sm:py-14">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Globe2 size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                  Live graph
                </p>

                <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  {selectedName} network
                </h2>
              </div>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Every node and relationship shown below is generated from the
              CognoDB travel graph.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {loadingCities ? (
              <div className="h-10 w-44 animate-pulse rounded-xl bg-slate-200" />
            ) : (
              <div className="relative">
                <label htmlFor="network-city" className="sr-only">
                  Select destination
                </label>

                <select
                  id="network-city"
                  value={selectedCity}
                  onChange={(event) => {
                    const city = cities.find(
                      (item) => item.id === event.target.value
                    );

                    if (city) {
                      selectCity(city);
                    }
                  }}
                  className="h-10 min-w-44 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-slate-600">
                Connected graph
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-400">
              <span>Drag</span>
              <span>•</span>
              <span>Zoom</span>
              <span>•</span>
              <span>Select nodes</span>
            </div>
          </div>

          <div className="p-2 sm:p-4">
            <TravelGraph
              cityId={selectedCity}
              cityName={selectedName}
            />
          </div>
        </div>

        {/* GRAPH EXPLANATION */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <NetworkCard
            icon={<Waypoints size={18} />}
            title="Nodes"
            text="Cities and destinations become connected graph entities."
          />

          <NetworkCard
            icon={<Route size={18} />}
            title="Relationships"
            text="Flights, trains, buses and ferries are represented as graph edges."
          />

          <NetworkCard
            icon={<Network size={18} />}
            title="Traversal"
            text="Follow multiple relationships to discover routes beyond direct connections."
          />
        </div>

        <div className="mt-5 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
              <Sparkles size={18} />
            </div>

            <div>
              <h3 className="font-bold text-teal-950">
                Why the graph matters
              </h3>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-teal-900/70">
                The interesting part of travel isn't just the destination.
                It's how destinations connect. CognoDB lets us traverse those
                relationships directly to discover direct and multi-hop
                journeys.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function NetworkCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>

      <p className="mt-1.5 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
