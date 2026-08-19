"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/GoogleIcon";
import { cn } from "@/lib/utils";

type Tab = "login" | "signup";

export function AuthCard({ initialTab, onSuccess }: { initialTab: Tab; onSuccess?: () => void }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchTab(next: Tab) {
    setTab(next);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } =
      tab === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ name, email, password });

    if (error) {
      setLoading(false);
      setError(error.message ?? "Something went wrong.");
      return;
    }

    setLoading(false);
    onSuccess?.();
  }

  return (
    <div className="w-full max-w-sm rounded-xl bg-gray-700 p-6">
      <div className="mb-4 flex rounded-lg bg-black/30 p-1">
        <button
          type="button"
          onClick={() => switchTab("login")}
          className={cn(
            "flex-1 rounded-md p-2 text-sm transition-colors",
            tab === "login" ? "bg-white text-black" : "text-white hover:bg-white/10"
          )}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => switchTab("signup")}
          className={cn(
            "flex-1 rounded-md p-2 text-sm transition-colors",
            tab === "signup" ? "bg-white text-black" : "text-white hover:bg-white/10"
          )}
        >
          Sign up
        </button>
      </div>

      <button
        onClick={() => authClient.signIn.social({ provider: "google" })}
        className="flex w-full items-center justify-center gap-2 rounded border bg-white p-2 text-black"
      >
        <GoogleIcon />
        {tab === "login" ? "Log in with Google" : "Sign up with Google"}
      </button>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        {tab === "signup" && (
          <label className="flex flex-col gap-1">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border rounded p-2"
            />
          </label>
        )}

        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded p-2"
          />
        </label>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded border bg-white p-2 text-black transition-colors duration-300 hover:bg-green-600"
        >
          {loading ? (
            <span className="loading loading-infinity loading-xl"></span>
          ) : tab === "login" ? (
            "Log in"
          ) : (
            "Sign up"
          )}
        </button>
      </form>
    </div>
  );
}
