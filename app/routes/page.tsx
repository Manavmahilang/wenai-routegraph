//app/routes/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  GitBranch,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";

import { RouteFinder } from "../components/RouteFinder";

function RoutesPageContent() {
  const searchParams = useSearchParams();

  const initialFrom =
    searchParams.get("from") ?? "";

  return (
    <main className="min-h-screen bg-[#f5f7f8]">
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}

      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -right-32 -top-48 h-[38rem] w-[38rem] rounded-full bg-teal-500/20 blur-3xl" />

          <div className="absolute -bottom-64 left-[18%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />

          <svg
            className="absolute inset-0 h-full w-full opacity-[0.07]"
            viewBox="0 0 1440 620"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-80 480C160 420 210 180 470 250C700 312 700 510 930 420C1130 340 1200 100 1520 150"
              stroke="currentColor"
              strokeWidth="1"
            />

            <path
              d="M-80 160C170 250 300 390 510 330C730 270 810 70 1020 160C1210 240 1260 440 1520 390"
              stroke="currentColor"
              strokeWidth="1"
            />

            <circle
              cx="470"
              cy="250"
              r="4"
              fill="currentColor"
            />

            <circle
              cx="930"
              cy="420"
              r="4"
              fill="currentColor"
            />

            <circle
              cx="1020"
              cy="160"
              r="4"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="travel-container relative py-16 sm:py-20 lg:py-24 xl:py-28">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300 backdrop-blur-xl">
              <GitBranch size={14} />
              Journey planner
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Go further.
              <br />

              <span className="text-teal-300">
                Choose your way.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Compare the ways to travel between two
              destinations and choose the journey that
              fits your time, distance and connections.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PLANNER                                                          */}
      {/* This is the primary content on the page, so it gets a wider      */}
      {/* container than the site's default `travel-container`.           */}
      {/* ================================================================ */}

      <section className="relative">
        <div className="mx-auto -mt-8 w-full max-w-[1440px] px-4 pb-16 sm:-mt-12 sm:px-6 sm:pb-20 lg:-mt-16 lg:px-10 lg:pb-28 xl:px-16">
          <RouteFinder initialFrom={initialFrom} />
        </div>
      </section>

      {/* ================================================================ */}
      {/* SMALL GUIDANCE STRIP                                             */}
      {/* ================================================================ */}

      <section className="border-t border-slate-200 bg-white">
        <div className="travel-container py-8 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Sparkles size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Compare before you choose
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Look at travel time, distance, connections
                  and transport modes to find the right fit.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
              <span>Search</span>

              <ArrowRight size={13} />

              <span>Compare</span>

              <ArrowRight size={13} />

              <span>Choose</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function RoutesPage() {
  return (
    <Suspense fallback={<RoutesPageSkeleton />}>
      <RoutesPageContent />
    </Suspense>
  );
}

function RoutesPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#f5f7f8]">
      <section className="bg-slate-950">
        <div className="travel-container py-20 sm:py-24">
          <div className="h-8 w-36 animate-pulse rounded-full bg-white/10" />

          <div className="mt-7 h-28 max-w-3xl animate-pulse rounded-2xl bg-white/10" />

          <div className="mt-6 h-6 max-w-xl animate-pulse rounded bg-white/10" />
        </div>
      </section>

      <div className="mx-auto -mt-10 w-full max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-10 xl:px-16">
        <div className="h-[620px] animate-pulse rounded-[2.5rem] bg-white shadow-xl" />
      </div>
    </main>
  );
}