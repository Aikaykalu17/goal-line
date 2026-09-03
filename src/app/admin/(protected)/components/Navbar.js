"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  FaBars,
  FaCalendarAlt,
  FaCheckCircle,
  FaChartBar,
  FaCog,
  FaMoneyBillWave,
  FaRegCalendarAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTag,
  FaTimes,
} from "react-icons/fa";

export const PRIMARY_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { href: "/admin/bookings", label: "Bookings", icon: FaCalendarAlt },
  { href: "/admin/calendar", label: "Calendar", icon: FaRegCalendarAlt },
];

export const MORE_LINKS = [
  { href: "/admin/verify-id", label: "Verify ID", icon: FaCheckCircle },
  { href: "/admin/pricing", label: "Pricing", icon: FaMoneyBillWave },
  { href: "/admin/promo", label: "Promo Codes", icon: FaTag },
  { href: "/admin/reports", label: "Reports", icon: FaChartBar },
  { href: "/admin/settings", label: "Settings", icon: FaCog },
];

export const NAV_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

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

  useEffect(() => {
    if (!moreSheetOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [moreSheetOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm md:hidden">
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
                    onClick={() => handleNavigation(href)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${active ? "bg-(--forest) text-white" : "text-gray-700 hover:bg-gray-100"}`}
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

      <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.25rem)] max-w-130 -translate-x-1/2 rounded-2xl border border-white/20 bg-(--forest) p-2 shadow-[0_18px_40px_rgba(13,61,47,0.35)] md:hidden">
        <div className="grid grid-cols-3 gap-1">
          {PRIMARY_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <button
                key={href}
                type="button"
                onClick={() => handleNavigation(href)}
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] ${active ? "bg-white/10 text-white" : "text-white/70"}`}
              >
                <Icon size={14} />
                <span className="mt-1">{label.split(" ")[0]}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreSheetOpen(true)}
            className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] ${pathname.startsWith("/admin/") && !PRIMARY_LINKS.some((link) => link.href === pathname) ? "bg-white/10 text-white" : "text-white/70"}`}
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
                    onClick={() => handleNavigation(href)}
                    className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ${active ? "border-(--forest) bg-(--forest) text-white" : "border-gray-200 bg-gray-50 text-slate-700 hover:border-(--primary) hover:bg-green-50"}`}
                  >
                    <Icon
                      size={13}
                      className={active ? "text-white" : "text-(--primary)"}
                    />
                    {label}
                    <span
                      className={`ml-auto text-xs ${active ? "text-white/70" : "text-(--primary)"}`}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
