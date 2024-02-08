import { defineConfig } from 'drizzle-kit'
export default defineConfig({
 schema: "./server/db/schema/",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  out: './migrations'
})