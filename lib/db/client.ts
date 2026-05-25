import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

import { seedDatabaseIfEmpty } from "@/lib/db/seed";

let db: Database.Database | null = null;

function getDatabasePath(): string {
  const configured = process.env.DATABASE_PATH;
  if (configured) return configured;
  return path.join(process.cwd(), "data", "notices.db");
}

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const connection = new Database(dbPath);
  connection.pragma("journal_mode = WAL");

  const schemaPath = path.join(process.cwd(), "lib", "db", "schema.sql");
  connection.exec(fs.readFileSync(schemaPath, "utf8"));

  seedDatabaseIfEmpty(connection);
  db = connection;
  return connection;
}
