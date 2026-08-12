// Location in your project: src/lib/auth.ts
//
// This is Better Auth's server-side config — it's what the CLI reads
// to know which models to generate into schema.prisma, and it's what
// your API routes will use later to actually log people in.

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Simplest option to start with: email + password, no third-party
  // login providers to configure yet. Can add Google/GitHub sign-in
  // later without restructuring anything.
  emailAndPassword: {
    enabled: true,
  },
});
