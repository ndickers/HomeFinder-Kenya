import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import "dotenv/config";
import * as schema from "./schema";
const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const db = drizzle(pool, { schema, logger: true });

export default db;
