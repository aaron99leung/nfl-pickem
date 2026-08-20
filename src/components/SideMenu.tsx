"use client";

import { useRef, useState } from "react";
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
import { authClient } from "@/lib/auth-client";

const LINKS: { href: string; label: string; icon?: IconDefinition; requiresAuth?: boolean }[] = [
  { href: "/", label: "Home", icon: faHouse },
  { href: "/games", label: "Games", icon: faCalendarWeek },
  { href: "/teams", label: "Teams", icon: faPeopleGroup },
  { href: "/leaderboard", label: "Hail Mary Rankings", icon: faRankingStar },
  { href: "/profile", label: "Profile", icon: faUserPen, requiresAuth: true },
];

export function SideMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = authClient.useSession();
  const [tooltipHref, setTooltipHref] = useState<string | null>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showTooltip(href: string) {
    setTooltipHref(href);
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = setTimeout(() => setTooltipHref(null), 2000);
  }

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
          {LINKS.map((link) => {
            const locked = link.requiresAuth && !session;

            if (locked) {
              return (
                <li key={link.href} className="relative">
                  <button
                    type="button"
                    onClick={() => showTooltip(link.href)}
                    aria-disabled
                    className="flex w-full cursor-not-allowed items-center justify-between py-2 text-white/40"
                  >
                    {link.label}
                    {link.icon && <FontAwesomeIcon icon={link.icon} />}
                  </button>

                  {tooltipHref === link.href && (
                    <div className="absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black shadow-lg">
                      <span className="absolute top-1/2 -left-1 size-2 -translate-y-1/2 rotate-45 bg-white" />
                      You must be logged in for this page
                    </div>
                  )}
                </li>
              );
            }

            return (
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
            );
          })}
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
