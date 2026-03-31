import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        nickname TEXT NOT NULL,
        tag TEXT DEFAULT '',
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id),
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS terms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        definition TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }
  return _db;
}

export const db = new Proxy({} as Database.Database, {
  get(_target, prop) {
    const realDb = getDb();
    const val = (realDb as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof val === "function") {
      return val.bind(realDb);
    }
    return val;
  },
});
