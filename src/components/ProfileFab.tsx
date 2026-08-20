"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { authClient } from "@/lib/auth-client";

export function ProfileFab() {
  const { data: session } = authClient.useSession();

  if (!session) return null;

  return (
    <Link
      href="/profile"
      aria-label="Your profile"
      className="fixed right-6 bottom-6 z-40 flex size-12 items-center justify-center rounded-full bg-zinc-900 shadow-lg transition-colors hover:bg-zinc-800"
    >
      <FontAwesomeIcon icon={faUserPen} className="text-white" />
    </Link>
  );
}
