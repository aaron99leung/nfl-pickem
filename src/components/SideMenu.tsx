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
  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex ${open ? "" : "pointer-events-none"}`}
    >
      <nav
        className={`w-64 bg-white p-4 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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

      <button
        aria-label="Close menu"
        onClick={onClose}
        className={`flex-1 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
