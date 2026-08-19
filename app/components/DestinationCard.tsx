"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Sparkles,
} from "lucide-react";

import type { City } from "@/lib/types";

interface DestinationCardProps {
  city: City;
  featured?: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85";

export function DestinationCard({
  city,
  featured = false,
}: DestinationCardProps) {
  const image = city.image || FALLBACK_IMAGE;

  return (
    <Link
      href={`/cities/${city.id}`}
      className={`group relative block overflow-hidden rounded-[1.75rem] bg-slate-900 ${
        featured
          ? "min-h-[430px]"
          : "min-h-[330px]"
      }`}
    >
      <Image
        src={image}
        alt={`${city.name}, ${city.countryName ?? ""}`}
        fill
        priority={featured}
        sizes={
          featured
            ? "(max-width: 768px) 100vw, 50vw"
            : "(max-width: 768px) 100vw, 25vw"
        }
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
      />

      {/* layered image treatment */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <div className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            {city.countryName}
          </span>
        </div>

        <span className="flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        {city.tags && city.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {city.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold capitalize text-white/80 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3
              className={`font-bold tracking-[-0.025em] text-white ${
                featured
                  ? "text-3xl sm:text-4xl"
                  : "text-2xl"
              }`}
            >
              {city.name}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/70">
              {city.description}
            </p>
          </div>

          <div className="hidden shrink-0 sm:flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={17} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/70">
          <Sparkles size={13} />
          Explore destination
        </div>
      </div>
    </Link>
  );
}