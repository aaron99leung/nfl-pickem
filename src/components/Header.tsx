"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogIn, UserPlus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPen,
  faPersonThroughWindow,
} from "@fortawesome/free-solid-svg-icons";
import { authClient } from "@/lib/auth-client";
import { SideMenu } from "@/components/SideMenu";
import { betrayed } from "@/lib/fonts";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="relative z-[20] flex items-center justify-between border-b border-[#000000] bg-black px-4 py-1">
      <div className="flex items-center gap-4">
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="rounded p-2 hover:bg-white/10"
        >
          <Menu />
        </button>

        <Link
          href="/"
          aria-label="Home"
          className={`translate-y-[9px] rounded p-2 text-xl ${betrayed.className}`}
        >
          Hail Mary
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
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="flex items-center gap-1.5 rounded p-2 text-white text-sm hover:bg-white/10"
            >
              <LogIn />
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-1.5 rounded p-2 text-white text-sm hover:bg-white/10"
            >
              <UserPlus />
              Sign up
            </Link>
          </div>
        )}
      </div>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
