"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

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
    <div className="mx-auto max-w-sm p-4">
      <h1 className="mb-4 text-xl">Sign in</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2"
          />
        </label>

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" className="border p-2">
          Sign in
        </button>
      </form>

      <button
        onClick={() => authClient.signIn.social({ provider: "google" })}
        className="mt-3 w-full border p-2"
      >
        Sign in with Google
      </button>

      <p className="mt-4">
        No account?{" "}
        <Link href="/sign-up" className="underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
