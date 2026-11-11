import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Загружаем .env, чтобы команды drizzle-kit видели DATABASE_URL
config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: false,
});
