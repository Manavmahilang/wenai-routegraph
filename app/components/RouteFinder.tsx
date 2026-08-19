"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDownUp,
  ArrowRight,
  BusFront,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  GitBranch,
  LoaderCircle,
  MapPin,
  Plane,
  Route as RouteIcon,
  Search,
  ShipWheel,
  Sparkles,
  TrainFront,
  X,
} from "lucide-react";

import type {
  City,
  RoutePath,
  TransportMode,
} from "@/lib/types";

interface RouteFinderProps {
  initialFrom?: string;
}

type SortMode =
  | "fastest"
  | "fewest-stops"
  | "shortest";

export function RouteFinder({
  initialFrom = "",
}: RouteFinderProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState("");
  const [routes, setRoutes] = useState<RoutePath[]>([]);

  const [loading, setLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [sortMode, setSortMode] =
    useState<SortMode>("fastest");

  const [expandedRoute, setExpandedRoute] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCities() {
      setCitiesLoading(true);
      setError("");

      try {
        const response = await fetch("/api/cities", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            "Unable to load destinations."
          );
        }

        const data: City[] = await response.json();

        if (cancelled) return;

        setCities(data);

        if (
          initialFrom &&
          data.some(
            (city) => city.id === initialFrom
          )
        ) {
          setFrom(initialFrom);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load destinations."
          );
        }
      } finally {
        if (!cancelled) {
          setCitiesLoading(false);
        }
      }
    }

    loadCities();

    return () => {
      cancelled = true;
    };
  }, [initialFrom]);

  const selectedFrom = useMemo(
    () => cities.find((city) => city.id === from),
    [cities, from]
  );

  const selectedTo = useMemo(
    () => cities.find((city) => city.id === to),
    [cities, to]
  );

  const getRouteKey = (route: RoutePath) =>
    route.cities.map((city) => city.id).join("->");

  const fastestRouteKey = useMemo(() => {
    if (!routes.length) {
      return null;
    }

    const fastest = routes.reduce(
      (best, route) => {
        if (
          route.totalDurationMinutes <
          best.totalDurationMinutes
        ) {
          return route;
        }

        if (
          route.totalDurationMinutes ===
          best.totalDurationMinutes
        ) {
          if (route.stops < best.stops) {
            return route;
          }

          if (
            route.stops === best.stops &&
            route.totalDistanceKm <
              best.totalDistanceKm
          ) {
            return route;
          }
        }

        return best;
      }
    );

    return getRouteKey(fastest);
  }, [routes]);

  const sortedRoutes = useMemo(() => {
    const copy = [...routes];

    switch (sortMode) {
      case "fewest-stops":
        return copy.sort((a, b) => {
          if (a.stops !== b.stops) {
            return a.stops - b.stops;
          }

          if (
            a.totalDurationMinutes !==
            b.totalDurationMinutes
          ) {
            return (
              a.totalDurationMinutes -
              b.totalDurationMinutes
            );
          }

          return (
            a.totalDistanceKm -
            b.totalDistanceKm
          );
        });

      case "shortest":
        return copy.sort((a, b) => {
          if (
            a.totalDistanceKm !==
            b.totalDistanceKm
          ) {
            return (
              a.totalDistanceKm -
              b.totalDistanceKm
            );
          }

          if (
            a.totalDurationMinutes !==
            b.totalDurationMinutes
          ) {
            return (
              a.totalDurationMinutes -
              b.totalDurationMinutes
            );
          }

          return a.stops - b.stops;
        });

      case "fastest":
      default:
        return copy.sort((a, b) => {
          if (
            a.totalDurationMinutes !==
            b.totalDurationMinutes
          ) {
            return (
              a.totalDurationMinutes -
              b.totalDurationMinutes
            );
          }

          if (a.stops !== b.stops) {
            return a.stops - b.stops;
          }

          return (
            a.totalDistanceKm -
            b.totalDistanceKm
          );
        });
    }
  }, [routes, sortMode]);

  async function findRoutes() {
    setError("");
    setRoutes([]);
    setExpandedRoute(null);

    if (!from || !to) {
      setError(
        "Choose both a starting point and destination."
      );
      return;
    }

    if (from === to) {
      setError(
        "Starting point and destination must be different."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/routes?from=${encodeURIComponent(
          from
        )}&to=${encodeURIComponent(to)}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to calculate routes."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "The route service returned an invalid response."
        );
      }

      setRoutes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to calculate routes."
      );
    } finally {
      setLoading(false);
    }
  }

  function swapCities() {
    setFrom(to);
    setTo(from);
    setRoutes([]);
    setError("");
    setExpandedRoute(null);
  }

  function handleFromChange(value: string) {
    setFrom(value);
    setRoutes([]);
    setError("");
    setExpandedRoute(null);
  }

  function handleToChange(value: string) {
    setTo(value);
    setRoutes([]);
    setError("");
    setExpandedRoute(null);
  }

  /**
   * Popular destination chips fill whichever leg of the
   * journey is still empty. Once both legs are filled,
   * further clicks replace the destination so the user can
   * keep exploring without hunting for the dropdown.
   */
  function handlePopularSelect(city: City) {
    if (city.id === from) return;

    if (!from) {
      handleFromChange(city.id);
      return;
    }

    if (!to || to === city.id) {
      handleToChange(city.id);
      return;
    }

    handleToChange(city.id);
  }

  if (citiesLoading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto]">
          <SkeletonField />
          <div className="hidden h-11 w-11 animate-pulse rounded-full bg-slate-100 lg:block" />
          <SkeletonField />
          <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const showSuggestions = !loading && routes.length === 0;

  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------------ */}
      {/* JOURNEY PLANNER                                                    */}
      {/* NOTE: no `overflow-hidden` on this section — the CitySelect        */}
      {/* dropdown below is absolutely positioned, and clipping the section  */}
      {/* would cut the dropdown off instead of letting it float over the    */}
      {/* page. Rounded corners are applied to the header/body individually  */}
      {/* instead, so the card still looks clipped without breaking the      */}
      {/* popover.                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.06]">
        <div className="rounded-t-[2rem] border-b border-slate-100 px-6 py-6 sm:px-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">
                Journey planner
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                Find the best way to get there
              </h2>
            </div>

            {routes.length > 0 && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Journeys found
              </span>
            )}
          </div>
        </div>

        <div className="relative rounded-b-[2rem] p-6 sm:p-9">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] lg:items-end">
            <CitySelect
              label="From"
              value={from}
              cities={cities}
              exclude={to}
              onChange={handleFromChange}
            />

            <div className="flex justify-center lg:h-16 lg:items-center">
              <button
                type="button"
                onClick={swapCities}
                disabled={!from && !to}
                aria-label="Swap origin and destination"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowDownUp size={17} />
              </button>
            </div>

            <CitySelect
              label="To"
              value={to}
              cities={cities}
              exclude={from}
              onChange={handleToChange}
            />

            <button
              type="button"
              onClick={findRoutes}
              disabled={loading || !from || !to}
              className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Searching
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find journeys
                </>
              )}
            </button>
          </div>

          {selectedFrom && selectedTo && (
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-600">
                {selectedFrom.name}
              </span>

              <ArrowRight size={13} />

              <span className="font-semibold text-slate-600">
                {selectedTo.name}
              </span>

              <span className="ml-1 hidden text-slate-300 sm:inline">
                •
              </span>

              <span className="hidden sm:inline">
                Finding routes with up to 4 connections
              </span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700"
            >
              <RouteIcon
                size={17}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* POPULAR DESTINATIONS                                               */}
      {/* Fills the idle state (before/between searches) and doubles as a    */}
      {/* fast way to build a journey without opening the dropdown.          */}
      {/* ------------------------------------------------------------------ */}

      {showSuggestions && (
        <PopularDestinations
          cities={cities}
          from={from}
          to={to}
          onSelect={handlePopularSelect}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* RESULTS                                                            */}
      {/* ------------------------------------------------------------------ */}

      {routes.length > 0 && (
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">
                  {selectedFrom?.name}
                  {" → "}
                  {selectedTo?.name}
                </p>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {routes.length}
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Compare your journeys
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose the journey that works best for you.
              </p>
            </div>

            <div
              className="flex w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:w-auto"
              aria-label="Sort routes"
            >
              <SortButton
                active={sortMode === "fastest"}
                onClick={() =>
                  setSortMode("fastest")
                }
              >
                Fastest
              </SortButton>

              <SortButton
                active={
                  sortMode === "fewest-stops"
                }
                onClick={() =>
                  setSortMode("fewest-stops")
                }
              >
                Fewest connections
              </SortButton>

              <SortButton
                active={sortMode === "shortest"}
                onClick={() =>
                  setSortMode("shortest")
                }
              >
                Shortest
              </SortButton>
            </div>
          </div>

          <div className="space-y-5">
            {sortedRoutes.map((route) => {
              const routeKey = getRouteKey(route);

              return (
                <RouteResult
                  key={routeKey}
                  route={route}
                  recommended={
                    routeKey === fastestRouteKey
                  }
                  expanded={
                    expandedRoute === routeKey
                  }
                  onToggle={() =>
                    setExpandedRoute(
                      expandedRoute === routeKey
                        ? null
                        : routeKey
                    )
                  }
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* EMPTY                                                              */}
      {/* ------------------------------------------------------------------ */}

      {!loading &&
        routes.length === 0 &&
        !error &&
        from &&
        to && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <GitBranch size={28} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              No journey found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find a route between these
              destinations. Try another pair of cities.
            </p>
          </div>
        )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* POPULAR DESTINATIONS                                                      */
/* -------------------------------------------------------------------------- */

function PopularDestinations({
  cities,
  from,
  to,
  onSelect,
}: {
  cities: City[];
  from: string;
  to: string;
  onSelect: (city: City) => void;
}) {
  const suggestions = useMemo(
    () =>
      cities
        .filter(
          (city) => city.id !== from && city.id !== to
        )
        .slice(0, 8),
    [cities, from, to]
  );

  if (!suggestions.length) {
    return null;
  }

  const heading = !from
    ? "Popular destinations"
    : !to
      ? `Popular places to go from ${
          cities.find((city) => city.id === from)
            ?.name ?? "here"
        }`
      : "Keep exploring";

  return (
    <section>
      <div className="mb-5 flex items-center gap-2">
        <Sparkles
          size={16}
          className="text-teal-700"
        />

        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          {heading}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {suggestions.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelect(city)}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/[0.08]"
          >
            <DestinationImage city={city} />

            <div className="p-3.5">
              <p className="truncate text-sm font-bold text-slate-900">
                {city.name}
              </p>

              <p className="truncate text-xs text-slate-400">
                {[city.regionName, city.countryName]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function DestinationImage({ city }: { city: City }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = city.image;

  if (imageSrc && !imageFailed) {
    return (
      <div className="relative h-28 w-full overflow-hidden bg-slate-100 sm:h-32">
        <Image
          key={imageSrc}
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImageFailed(true)}
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-28 w-full items-center justify-center bg-teal-50 text-teal-700 sm:h-32">
      <MapPin size={22} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CITY SELECT                                                                */
/* -------------------------------------------------------------------------- */

function CitySelect({
  label,
  value,
  cities,
  exclude,
  onChange,
}: {
  label: string;
  value: string;
  cities: City[];
  exclude: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedCity = cities.find(
    (city) => city.id === value
  );

  const filteredCities = useMemo(() => {
    const normalized = query
      .trim()
      .toLowerCase();

    return cities
      .filter((city) => city.id !== exclude)
      .filter((city) => {
        if (!normalized) return true;

        return (
          city.name
            .toLowerCase()
            .includes(normalized) ||
          city.countryName
            ?.toLowerCase()
            .includes(normalized) ||
          city.regionName
            ?.toLowerCase()
            .includes(normalized)
        );
      });
  }, [cities, exclude, query]);

  function chooseCity(city: City) {
    onChange(city.id);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex h-16 w-full items-center gap-3 rounded-2xl border bg-white px-4 text-left transition ${
          open
            ? "border-teal-300 ring-4 ring-teal-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <CityThumbnail city={selectedCity} />

        <div className="min-w-0 flex-1">
          {selectedCity ? (
            <>
              <p className="truncate text-base font-bold text-slate-900">
                {selectedCity.name}
              </p>

              <p className="truncate text-xs text-slate-400">
                {[
                  selectedCity.regionName,
                  selectedCity.countryName,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </>
          ) : (
            <p className="text-sm font-medium text-slate-400">
              Select a destination...
            </p>
          )}
        </div>

        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label={`Close ${label} selector`}
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
            className="fixed inset-0 z-30 cursor-default"
          />

          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
            <div className="border-b border-slate-100 p-3">
              <div className="flex h-11 items-center gap-2 rounded-xl bg-slate-50 px-3">
                <Search
                  size={16}
                  className="shrink-0 text-slate-400"
                />

                <input
                  autoFocus
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search destinations..."
                  aria-label={`Search ${label} destinations`}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() =>
                      setQuery("")
                    }
                    aria-label="Clear destination search"
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div
              className="max-h-96 overflow-y-auto p-2"
              role="listbox"
            >
              {filteredCities.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <MapPin
                    size={22}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No destinations found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try another city or country.
                  </p>
                </div>
              ) : (
                filteredCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    role="option"
                    aria-selected={
                      city.id === value
                    }
                    onClick={() =>
                      chooseCity(city)
                    }
                    className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-teal-50"
                  >
                    <CityThumbnail
                      city={city}
                      size="small"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {city.name}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {[
                          city.regionName,
                          city.countryName,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>

                    {city.id === value ? (
                      <Check
                        size={16}
                        className="text-teal-700"
                      />
                    ) : (
                      <ArrowRight
                        size={15}
                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-700"
                      />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ROUTE RESULT                                                               */
/* -------------------------------------------------------------------------- */

function RouteResult({
  route,
  recommended,
  expanded,
  onToggle,
}: {
  route: RoutePath;
  recommended: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const modes = Array.from(
    new Set(route.modes)
  );

  return (
    <article
      className={`overflow-hidden rounded-[1.75rem] border bg-white transition duration-200 ${
        recommended
          ? "border-teal-200 shadow-xl shadow-teal-900/[0.07]"
          : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-lg"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full text-left"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {recommended && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    <Check size={11} />
                    Fastest
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {route.stops === 0
                    ? "Direct"
                    : `${route.stops} ${
                        route.stops === 1
                          ? "connection"
                          : "connections"
                      }`}
                </span>
              </div>

              <RouteTimeline
                cities={route.cities}
              />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {modes.map((mode) => (
                  <TransportBadge
                    key={mode}
                    mode={mode}
                  />
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-6 border-t border-slate-100 pt-4 sm:justify-start xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
              <RouteMetric
                icon={<Clock3 size={15} />}
                value={formatDuration(
                  route.totalDurationMinutes
                )}
                label="travel time"
              />

              <RouteMetric
                icon={<RouteIcon size={15} />}
                value={`${Math.round(
                  route.totalDistanceKm
                ).toLocaleString()} km`}
                label="distance"
              />

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                {expanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-6 sm:px-8">
          <div className="mb-4 flex items-center gap-2">
            <GitBranch
              size={15}
              className="text-teal-700"
            />

            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">
              Journey breakdown
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {route.cities.map(
              (city, index) => {
                const nextCity =
                  route.cities[index + 1];

                const mode =
                  route.modes[index];

                return (
                  <div
                    key={`${city.id}-${index}`}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <CityThumbnail
                        city={city}
                        size="small"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {city.name}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {city.countryName ??
                            "Destination"}
                        </p>
                      </div>

                      {index === 0 && (
                        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                          Start
                        </span>
                      )}

                      {index ===
                        route.cities.length - 1 && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          Arrive
                        </span>
                      )}
                    </div>

                    {nextCity && (
                      <div className="ml-9 flex items-center gap-3 border-l border-slate-200 px-4 py-2">
                        <TransportBadge
                          mode={mode}
                          compact
                        />

                        <div className="h-px flex-1 bg-slate-100" />

                        <ArrowRight
                          size={14}
                          className="text-slate-300"
                        />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <JourneyStat
              label="Connections"
              value={String(route.stops)}
            />

            <JourneyStat
              label="Transport modes"
              value={String(modes.length)}
            />

            <JourneyStat
              label="Distance"
              value={`${Math.round(
                route.totalDistanceKm
              ).toLocaleString()} km`}
            />
          </div>
        </div>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* ROUTE TIMELINE                                                             */
/* -------------------------------------------------------------------------- */

function RouteTimeline({
  cities,
}: {
  cities: City[];
}) {
  return (
    <div className="flex min-w-0 items-center">
      {cities.map((city, index) => {
        const isFirst = index === 0;
        const isLast =
          index === cities.length - 1;

        return (
          <div
            key={`${city.id}-${index}`}
            className={`flex min-w-0 items-center ${
              isLast ? "" : "flex-1"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    isFirst
                      ? "bg-teal-600 ring-4 ring-teal-50"
                      : isLast
                        ? "bg-slate-900 ring-4 ring-slate-100"
                        : "bg-slate-300"
                  }`}
                />

                <span
                  className={`truncate text-sm font-bold ${
                    isFirst || isLast
                      ? "text-slate-950"
                      : "text-slate-600"
                  }`}
                >
                  {city.name}
                </span>
              </div>
            </div>

            {!isLast && (
              <div className="mx-2 flex min-w-5 flex-1 items-center">
                <div className="h-px w-full bg-slate-200" />

                <ArrowRight
                  size={12}
                  className="shrink-0 text-slate-300"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TRANSPORT                                                                  */
/* -------------------------------------------------------------------------- */

function TransportBadge({
  mode,
  compact = false,
}: {
  mode: string;
  compact?: boolean;
}) {
  const normalized =
    mode.toUpperCase() as TransportMode;

  const config: Record<
    TransportMode,
    {
      label: string;
      icon: React.ReactNode;
    }
  > = {
    FLIGHT: {
      label: "Flight",
      icon: (
        <Plane
          size={compact ? 12 : 13}
        />
      ),
    },

    TRAIN: {
      label: "Train",
      icon: (
        <TrainFront
          size={compact ? 12 : 13}
        />
      ),
    },

    BUS: {
      label: "Bus",
      icon: (
        <BusFront
          size={compact ? 12 : 13}
        />
      ),
    },

    FERRY: {
      label: "Ferry",
      icon: (
        <ShipWheel
          size={compact ? 12 : 13}
        />
      ),
    },
  };

  const item =
    config[normalized] ?? {
      label:
        mode.charAt(0).toUpperCase() +
        mode.slice(1).toLowerCase(),

      icon: <RouteIcon size={13} />,
    };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 font-bold uppercase tracking-wide text-slate-600 ${
        compact
          ? "px-2 py-1 text-[9px]"
          : "px-2.5 py-1.5 text-[10px]"
      }`}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* SUPPORTING UI                                                              */
/* -------------------------------------------------------------------------- */

function CityThumbnail({
  city,
  size = "normal",
}: {
  city?: City;
  size?: "normal" | "small";
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const px = size === "small" ? 40 : 56;
  const boxClassName =
    size === "small" ? "h-10 w-10" : "h-14 w-14";

  const imageSrc = city?.image;

  if (imageSrc && !imageFailed) {
    return (
      <Image
        key={imageSrc}
        src={imageSrc}
        alt=""
        width={px}
        height={px}
        sizes={`${px}px`}
        onError={() => setImageFailed(true)}
        className={`${boxClassName} shrink-0 rounded-xl object-cover`}
      />
    );
  }

  return (
    <div
      className={`${boxClassName} flex shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700`}
    >
      <MapPin size={size === "small" ? 18 : 22} />
    </div>
  );
}

function RouteMetric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-teal-700">
        {icon}

        <span className="whitespace-nowrap text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          {value}
        </span>
      </div>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
}

function JourneyStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function SortButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold transition ${
        active
          ? "bg-slate-950 text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

function SkeletonField() {
  return (
    <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
  );
}

function formatDuration(minutes: number) {
  const safeMinutes = Math.max(
    0,
    Math.round(minutes)
  );

  const hours = Math.floor(
    safeMinutes / 60
  );

  const mins = safeMinutes % 60;

  if (!hours) {
    return `${mins}m`;
  }

  if (!mins) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}