//app/components/CitySearch.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LoaderCircle, MapPin, Search } from "lucide-react";
import type { City } from "@/lib/types";

export function CitySearch({
  placeholder = "Search destinations...",
  onSelect,
}: {
  placeholder?: string;
  onSelect: (city: City) => void;
}) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/cities?query=${encodeURIComponent(query)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to search destinations.");
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid destination response.");
        setCities(data as City[]);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setCities([]);
          setError(err instanceof Error ? err.message : "Unable to search destinations.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  return (
    <div className="relative">
      <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 shadow-2xl shadow-slate-950/20 backdrop-blur transition focus-within:border-teal-300/70 focus-within:ring-4 focus-within:ring-teal-300/15">
        <Search size={18} className="shrink-0 text-teal-200" />
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Search destinations"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
        />
        {loading && <LoaderCircle size={17} className="animate-spin text-teal-200" />}
      </div>

      {open && (
        <>
          <button type="button" aria-label="Close destination search" onClick={() => setOpen(false)} className="fixed inset-0 z-20 cursor-default" />
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl">
            {error ? <p role="alert" className="px-3 py-6 text-center text-sm text-red-600">{error}</p> : cities.length === 0 && !loading ? <p className="px-3 py-6 text-center text-sm text-slate-500">No destinations found.</p> : cities.map((city) => (
              <button key={city.id} type="button" onClick={() => { onSelect(city); setQuery(city.name); setOpen(false); }} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-teal-50 focus:bg-teal-50 focus:outline-none">
                {city.image ? <Image src={city.image} alt="" width={42} height={42} className="h-10 w-10 shrink-0 rounded-xl object-cover" /> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><MapPin size={16} /></span>}
                <span className="min-w-0"><span className="block truncate text-sm font-bold">{city.name}</span><span className="block truncate text-xs text-slate-500">{[city.regionName, city.countryName].filter(Boolean).join(" · ")}</span></span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
