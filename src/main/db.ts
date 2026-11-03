import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: Database.Database | null = null;

// Ouverture paresseuse : app.getPath('userData') ne doit pas être appelé à l'import.
export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(app.getPath('userData'), 'lea_assistant.sqlite');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDB() {
  const d = getDb();
  d.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      memory_enabled BOOLEAN DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS contact_memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id TEXT NOT NULL,
      fact TEXT NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Contact par défaut utilisé par l'interface (sinon la contrainte FOREIGN KEY rejette toute écriture de mémoire).
  d.prepare("INSERT OR IGNORE INTO contacts (id, name) VALUES ('contact_1', 'Alice')").run();
}
