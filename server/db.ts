import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

// For development, we'll use a fallback configuration if DATABASE_URL is not set
let db: any;

if (process.env.DATABASE_URL) {
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  // Fallback for development - create a mock db that won't fail
  console.warn("DATABASE_URL not set. Using mock database for development.");
  db = {
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [{}] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [{}] }) }) }),
  } as any;
}

export { db };