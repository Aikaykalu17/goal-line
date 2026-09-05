"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FaSignOutAlt } from "react-icons/fa";
import Spinner from "@/app/components/Spinner";
import Navbar, { NAV_LINKS } from "./components/Navbar";

export default function AdminProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

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

  useEffect(() => {
    if (!checking) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [checking]);

  function handleNavigation(href) {
    if (href === pathname) return;

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
          <Navbar />
          <main className="flex-1 p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
