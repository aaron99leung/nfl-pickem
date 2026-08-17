"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUserPen,
  faPersonThroughWindow,
} from "@fortawesome/free-solid-svg-icons";
import { authClient } from "@/lib/auth-client";
import { SideMenu } from "@/components/SideMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="rounded p-2 hover:bg-white/10"
        >
          <Menu />
        </button>

        <Link href="/" aria-label="Home" className="rounded p-2 hover:bg-white/10">
          <FontAwesomeIcon icon={faHouse} />
        </Link>
      </div>

      <div>
        {isPending ? null : session ? (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              aria-label="Your profile"
              className="rounded p-2 hover:bg-white/10"
            >
              <FontAwesomeIcon icon={faUserPen} />
            </Link>
            <button
              onClick={() => authClient.signOut()}
              aria-label="Log out"
              className="rounded p-2 text-red-500 hover:bg-white/10"
            >
              <FontAwesomeIcon icon={faPersonThroughWindow} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/sign-in"
              className="rounded-2xl border border-blue-600 bg-blue-600 px-3 py-1 text-white"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-2xl border border-red-600 bg-red-600 px-3 py-1 text-white"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
