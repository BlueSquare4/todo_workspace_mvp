const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "tasks.db");
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('todo','in-progress','done')) NOT NULL,
    priority TEXT CHECK(priority IN ('low','medium','high')) NOT NULL,
    dueDate TEXT,
    createdAt TEXT NOT NULL
  )
`).run();

module.exports = db;
