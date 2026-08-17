"use client";

import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Game Schedules" },
  { href: "/teams", label: "Team Schedules" },
  { href: "/leaderboard", label: "Predictions Leaderboard" },
  { href: "/profile", label: "User Profile" },
];

export function SideMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Clicking the dimmed backdrop closes the menu, same as clicking outside it */}
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="flex-1 bg-black/50"
      />

      <nav className="w-64 bg-white p-4">
        <button onClick={onClose} className="mb-4 border px-3 py-1">
          Close
        </button>

        <ul className="flex flex-col gap-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={onClose} className="block py-2">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
