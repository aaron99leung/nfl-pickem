"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Goal, UserCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SideMenu } from "@/components/SideMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-3">
        <button aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <Goal />
          <span>NFL Pick&apos;em</span>
        </Link>
      </div>

      <div>
        {isPending ? null : session ? (
          <Link href="/profile" aria-label="Your profile">
            <UserCircle />
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link href="/sign-in" className="border px-3 py-1">
              Sign in
            </Link>
            <Link href="/sign-up" className="border px-3 py-1">
              Sign up
            </Link>
          </div>
        )}
      </div>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
