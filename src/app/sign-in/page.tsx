"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/GoogleIcon";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      setError(error.message ?? "Something went wrong.");
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[url('/image/authbg/football.jpg')] bg-cover bg-center p-4">
      <div className="w-full max-w-sm rounded-xl bg-gray-700/60 p-6">
        <h1 className="mb-4 text-xl">Log in</h1>

        <button
          onClick={() => authClient.signIn.social({ provider: "google" })}
          className="flex w-full items-center justify-center gap-2 rounded border bg-white p-2 text-black"
        >
          <GoogleIcon />
          Log in with Google
        </button>

        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
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
            className="rounded border bg-white p-2 text-black transition-colors duration-300 hover:bg-green-600"
          >
            Log in
          </button>
        </form>

        <p className="mt-4">
          No account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
