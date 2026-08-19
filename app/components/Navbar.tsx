//app/components/Navbar.tsx
import Link from "next/link";
import {
  Compass,
  GitBranch,
  Network,
} from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="travel-container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <Compass size={20} />
          </span>

          <span className="text-[17px] font-bold tracking-tight text-slate-900">
            RouteGraph
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 sm:flex"
        >
          <NavLink
            href="/explore"
            icon={<Compass size={16} />}
            label="Explore"
          />

          <NavLink
            href="/routes"
            icon={<GitBranch size={16} />}
            label="Routes"
          />

          <NavLink
            href="/network"
            icon={<Network size={16} />}
            label="Network"
          />
        </nav>

        <Link
          href="/routes"
          className="rounded-lg bg-teal-700 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-teal-800 sm:hidden"
        >
          Plan route
        </Link>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      {icon}
      {label}
    </Link>
  );
}