"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      setLoading(false);
      setError(error.message ?? "Something went wrong.");
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[url('/image/authbg/football.jpg')] bg-cover bg-center p-4">
      <div className="w-full max-w-sm rounded-xl bg-gray-700/60 p-6">
        <h1 className="mb-4 text-xl">Sign up</h1>

        <button
          onClick={() => authClient.signIn.social({ provider: "google" })}
          className="flex w-full items-center justify-center gap-2 rounded border bg-white p-2 text-black"
        >
          <GoogleIcon />
          Log in with Google
        </button>

        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
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
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <p className="mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
