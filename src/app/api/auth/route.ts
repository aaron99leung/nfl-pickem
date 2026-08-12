// Location in your project: src/app/api/auth/[...all]/route.ts
//
// The folder name "[...all]" is a Next.js "catch-all route" — it matches
// every path under /api/auth/*, not just one exact URL. Better Auth needs
// this because it handles many different endpoints internally
// (/api/auth/sign-in, /api/auth/sign-up, /api/auth/sign-out,
// /api/auth/session, and more) — rather than you writing a separate
// route file for each one, this single file hands all of them off to
// Better Auth's own internal router.

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
