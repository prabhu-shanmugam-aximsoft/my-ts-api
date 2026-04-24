import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}

export class DB {
  private static pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  static query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}