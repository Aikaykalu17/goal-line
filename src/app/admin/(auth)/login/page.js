"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SpinnerMini from "../components/SpinnerMini";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--background) p-4 relative overflow-hidden">
      <div className="z-50 flex justify-start absolute left-4 top-4">
        <Image
          src="/logo.webp"
          alt="Goal Line Turf logo"
          width={150}
          height={300}
          priority
          loading="eager"
          sizes="(max-width: 768px) 500px, 500px"
          style={{ objectFit: "contain" }}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-(--border) bg-white p-8 space-y-4"
        aria-labelledby="admin-login-heading"
      >
        <h1
          id="admin-login-heading"
          className="text-base font-bold text-(--text)"
        >
          Admin Login
        </h1>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          aria-invalid={!!error}
          className="border border-gray-300 rounded p-2 w-full text-xs"
        />

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          aria-invalid={!!error}
          className="border border-gray-300 rounded p-2 w-full text-xs"
        />

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full bg-(--primary) text-white py-2.5 rounded text-xs disabled:opacity-60 flex items-center gap-4 justify-center"
        >
          {isLoading ? (
            <>
              <SpinnerMini aria-hidden="true" />
              Logging in
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>
    </div>
  );
}
