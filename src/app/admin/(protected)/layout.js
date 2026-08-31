"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  FaTachometerAlt,
  FaCheckCircle,
  FaSignOutAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCog,
  FaBars,
  FaTimes,
  FaRegCalendarAlt,
} from "react-icons/fa";
import Spinner from "@/app/components/Spinner";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { href: "/admin/bookings", label: "Bookings", icon: FaCalendarAlt },
  { href: "/admin/calendar", label: "Calendar", icon: FaRegCalendarAlt },
  { href: "/admin/verify-id", label: "Verify ID", icon: FaCheckCircle },
  { href: "/admin/pricing", label: "Pricing", icon: FaMoneyBillWave },
  { href: "/admin/settings", label: "Settings", icon: FaCog },
];

export default function AdminProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setChecking(false);
    }

    verifySession();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f3]">
        <Spinner label="loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f3]  text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <aside className="hidden min-h-screen w-60 shrink-0 flex-col bg-(--forest) text-white md:flex">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-bold shadow-inner">
              G
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-white/80">
                GoalLine Turf
              </p>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-white/10 font-semibold text-white shadow-inner"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              <FaSignOutAlt size={14} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-var(--forest) text-sm font-bold text-white">
                  G
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    GoalLine Turf
                  </p>
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                </div>
              </div>

              <button
                onClick={() => setMobileNavOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700"
                aria-label="Toggle menu"
              >
                {mobileNavOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
              </button>
            </div>

            {mobileNavOpen && (
              <div className="border-t border-gray-200 bg-white px-3 py-3">
                <div className="space-y-1">
                  {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                          active
                            ? "bg-var(--forest) text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={13} />
                        {label}
                      </Link>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt size={13} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </header>

          <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
        </div>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.25rem)] max-w-130 -translate-x-1/2 rounded-2xl border border-white/20 bg-var(--forest) p-2 shadow-[0_18px_40px_rgba(13,61,47,0.35)] md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] ${
                  active ? "bg-white/10 text-white" : "text-white/70"
                }`}
              >
                <Icon size={14} />
                <span className="mt-1">{label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
