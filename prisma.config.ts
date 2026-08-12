import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Where your schema file lives
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  // Prisma 7 moved the connection URL here instead of hardcoding it
  // in schema.prisma's datasource block.
  datasource: {
    url: env("DATABASE_URL"),
  },
});
