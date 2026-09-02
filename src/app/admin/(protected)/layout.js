"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  FaTachometerAlt,
  FaCheckCircle,
  FaSignOutAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
  FaRegCalendarAlt,
  FaTag,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import Spinner from "@/app/components/Spinner";

const PRIMARY_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { href: "/admin/bookings", label: "Bookings", icon: FaCalendarAlt },
  { href: "/admin/calendar", label: "Calendar", icon: FaRegCalendarAlt },
];

const MORE_LINKS = [
  { href: "/admin/verify-id", label: "Verify ID", icon: FaCheckCircle },
  { href: "/admin/pricing", label: "Pricing", icon: FaMoneyBillWave },
  { href: "/admin/promo", label: "Promo Codes", icon: FaTag },
  { href: "/admin/reports", label: "Reports", icon: FaChartBar },
  { href: "/admin/settings", label: "Settings", icon: FaCog },
];

const NAV_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS];

export default function AdminProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  const mobilePrimaryLinks = useMemo(() => PRIMARY_LINKS, []);

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

  function handleNavigation(href) {
    if (href === pathname) return;

    setMobileNavOpen(false);
    setMoreSheetOpen(false);
    router.push(href);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (checking) {
    return <Spinner label="loading" fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f3] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <aside className="hidden min-h-screen w-60 shrink-0 flex-col bg-(--forest) text-white md:flex">
          <div className="flex items-center justify-center border-b border-white/10 px-5 py-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-bold text-white shadow-inner">
                G
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-white/80">
                  GoalLine Turf
                </p>
                <p className="text-xs text-white/60">Admin Panel</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <button
                  type="button"
                  key={href}
                  onClick={() => handleNavigation(href)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition cursor-pointer ${
                    active
                      ? "bg-white/10 font-semibold text-white shadow-inner cursor-pointer"
                      : "text-white/75 hover:bg-white/5 hover:text-white cursor-pointer"
                  }`}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--forest) text-sm font-bold text-white">
                  G
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-gray-500">
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
                {mobileNavOpen ? (
                  <FaTimes size={16} aria-hidden="true" />
                ) : (
                  <FaBars size={16} aria-hidden="true" />
                )}
              </button>
            </div>

            {mobileNavOpen && (
              <div className="border-t border-gray-200 bg-white px-3 py-3">
                <div className="space-y-1">
                  {PRIMARY_LINKS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;

                    return (
                      <button
                        key={href}
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          handleNavigation(href);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                          active
                            ? "bg-(--forest) text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      setMoreSheetOpen(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaBars size={13} />
                    More
                  </button>

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

          <main className="flex-1 p-4 pb-20 sm:p-6 md:p-8">{children}</main>
        </div>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.25rem)] max-w-130 -translate-x-1/2 rounded-2xl border border-white/20 bg-(--forest) p-2 shadow-[0_18px_40px_rgba(13,61,47,0.35)] md:hidden">
        <div className="grid grid-cols-3 gap-1">
          {mobilePrimaryLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <button
                key={href}
                type="button"
                onClick={() => handleNavigation(href)}
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] ${
                  active ? "bg-white/10 text-white" : "text-white/70"
                }`}
              >
                <Icon size={14} />
                <span className="mt-1">{label.split(" ")[0]}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreSheetOpen(true)}
            className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] ${
              pathname.startsWith("/admin/") &&
              !mobilePrimaryLinks.some((link) => link.href === pathname)
                ? "bg-white/10 text-white"
                : "text-white/70"
            }`}
          >
            <FaBars size={14} />
            <span className="mt-1">More</span>
          </button>
        </div>
      </nav>

      {moreSheetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 md:hidden">
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">More</p>
              <button
                type="button"
                onClick={() => setMoreSheetOpen(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-700"
                aria-label="Close more menu"
              >
                <FaTimes size={12} />
              </button>
            </div>

            <div className="space-y-2">
              {MORE_LINKS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;

                return (
                  <button
                    key={href}
                    type="button"
                    onClick={() => {
                      setMoreSheetOpen(false);
                      handleNavigation(href);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${
                      active
                        ? "bg-(--forest) text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
