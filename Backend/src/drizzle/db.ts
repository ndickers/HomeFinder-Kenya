import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import "dotenv/config";
import ws from "ws";
import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL as string,
});
const db = drizzle(pool, { schema, logger: true });

export default db;
