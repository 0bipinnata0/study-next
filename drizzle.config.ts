import { defineConfig } from "drizzle-kit";

console.info("POSTGRE_SQL", process.env.POSTGRE_SQL);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: 在env文件中
    url: process.env.POSTGRE_SQL!,
  },
});
