import * as Crypto from "expo-crypto";
import * as SQLite from "expo-sqlite";

export type SyncStatus =
  | "synced"
  | "pending_create"
  | "pending_update"
  | "pending_delete"
  | "conflict"
  | "failed";
export type LocalTemplate = {
  local_id: string;
  server_id: string | null;
  name: string;
  payload: string;
  updated_at: string;
  sync_status: SyncStatus;
};
let database: Promise<SQLite.SQLiteDatabase> | undefined;

export async function db() {
  database ??= SQLite.openDatabaseAsync("workout.db");
  const conn = await database;
  await conn.execAsync(`PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS sessions(local_id TEXT PRIMARY KEY,server_id TEXT,status TEXT NOT NULL,payload TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,sync_status TEXT NOT NULL,last_sync_attempt TEXT,deleted_at TEXT);
    CREATE TABLE IF NOT EXISTS templates(local_id TEXT PRIMARY KEY,server_id TEXT,name TEXT NOT NULL,payload TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,sync_status TEXT NOT NULL,last_sync_attempt TEXT,deleted_at TEXT);
    CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,entity_type TEXT NOT NULL,entity_id TEXT NOT NULL,operation TEXT NOT NULL,payload TEXT NOT NULL,created_at TEXT NOT NULL,attempts INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS timer(id INTEGER PRIMARY KEY CHECK(id=1),ends_at INTEGER,paused_remaining INTEGER,next_label TEXT);`);
  return conn;
}

async function queue(
  conn: SQLite.SQLiteDatabase,
  entityType: string,
  entityId: string,
  operation: string,
  payload: object,
) {
  await conn.runAsync(
    "INSERT INTO outbox VALUES(?,?,?,?,?,?,0)",
    Crypto.randomUUID(),
    entityType,
    entityId,
    operation,
    JSON.stringify(payload),
    new Date().toISOString(),
  );
}

export async function saveOfflineSession(payload: object) {
  const conn = await db();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();
  await conn.withTransactionAsync(async () => {
    await conn.runAsync(
      "INSERT INTO sessions VALUES(?,?,?,?,?,?,?,?,?)",
      id,
      null,
      "in_progress",
      JSON.stringify(payload),
      now,
      now,
      "pending_create",
      null,
      null,
    );
    await queue(conn, "workout", id, "create", payload);
  });
  return id;
}

export async function saveOfflineTemplate(payload: { name: string }) {
  const conn = await db();
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();
  await conn.withTransactionAsync(async () => {
    await conn.runAsync(
      "INSERT INTO templates VALUES(?,?,?,?,?,?,?,?,?)",
      id,
      null,
      payload.name,
      JSON.stringify(payload),
      now,
      now,
      "pending_create",
      null,
      null,
    );
    await queue(conn, "template", id, "create", payload);
  });
  return id;
}

export async function cacheServerTemplates(
  items: { id: string; name: string }[],
) {
  const conn = await db();
  const now = new Date().toISOString();
  await conn.withTransactionAsync(async () => {
    for (const item of items) {
      await conn.runAsync(
        `INSERT INTO templates VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(local_id) DO UPDATE SET name=excluded.name,payload=excluded.payload,updated_at=excluded.updated_at,sync_status='synced'`,
        item.id,
        item.id,
        item.name,
        JSON.stringify(item),
        now,
        now,
        "synced",
        null,
        null,
      );
    }
  });
}

export async function localTemplates() {
  return (await db()).getAllAsync<LocalTemplate>(
    "SELECT local_id,server_id,name,payload,updated_at,sync_status FROM templates WHERE deleted_at IS NULL ORDER BY updated_at DESC",
  );
}
export async function pendingCount() {
  return (
    (
      await (
        await db()
      ).getFirstAsync<{ n: number }>("SELECT count(*) n FROM outbox")
    )?.n ?? 0
  );
}
