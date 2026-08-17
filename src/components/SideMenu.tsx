"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUserPen,
  faCalendarWeek,
  faPeopleGroup,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const LINKS: { href: string; label: string; icon?: IconDefinition }[] = [
  { href: "/", label: "Home", icon: faHouse },
  { href: "/games", label: "Games", icon: faCalendarWeek },
  { href: "/teams", label: "Teams", icon: faPeopleGroup },
  { href: "/leaderboard", label: "Hail Mary Rankings", icon: faRankingStar },
  { href: "/profile", label: "Profile", icon: faUserPen },
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
        className={`w-64 bg-black p-4 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex justify-end">
          <button onClick={onClose} aria-label="Close menu">
            <ChevronLeft />
          </button>
        </div>

        <ul className="flex flex-col gap-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-2"
              >
                {link.label}
                {link.icon && <FontAwesomeIcon icon={link.icon} />}
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
