import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import "dotenv/config";

const pool = mysql2.createPool({
  uri: process.env.DATABASE_URL,
});

const db = drizzle(pool);
export default db;