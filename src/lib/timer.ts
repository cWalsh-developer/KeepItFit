import * as Notifications from "expo-notifications";
import { db } from "./database";
export async function startTimer(seconds: number, nextLabel: string) {
  const endsAt = Date.now() + seconds * 1000;
  const conn = await db();
  await conn.runAsync(
    "INSERT OR REPLACE INTO timer(id,ends_at,paused_remaining,next_label) VALUES(1,?,?,?)",
    endsAt,
    null,
    nextLabel,
  );
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Rest complete",
      body: `Next: ${nextLabel}`,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(endsAt),
    },
  });
  return endsAt;
}
export async function remaining() {
  const row = await (
    await db()
  ).getFirstAsync<{ ends_at: number | null; paused_remaining: number | null }>(
    "SELECT ends_at,paused_remaining FROM timer WHERE id=1",
  );
  return (
    row?.paused_remaining ??
    Math.max(0, (row?.ends_at ?? Date.now()) - Date.now())
  );
}
export async function adjustTimer(deltaSeconds: number) {
  const ms = await remaining();
  return startTimer(
    Math.max(0, Math.ceil(ms / 1000) + deltaSeconds),
    "your next set",
  );
}
