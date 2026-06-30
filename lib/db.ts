import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS reflections (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS pending_emotions (
      chat_id TEXT PRIMARY KEY,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS pending_followups (
      chat_id TEXT PRIMARY KEY,
      original_message TEXT NOT NULL,
      emotion_label TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function setPendingEmotion(chatId: string, message: string) {
  await sql`
    INSERT INTO pending_emotions (chat_id, message)
    VALUES (${chatId}, ${message})
    ON CONFLICT (chat_id) DO UPDATE SET message = ${message}, created_at = NOW()
  `;
}

export async function getPendingEmotion(chatId: string): Promise<string | null> {
  const rows = await sql`SELECT message FROM pending_emotions WHERE chat_id = ${chatId}`;
  return rows[0]?.message ?? null;
}

export async function clearPendingEmotion(chatId: string) {
  await sql`DELETE FROM pending_emotions WHERE chat_id = ${chatId}`;
}

export async function setPendingFollowup(
  chatId: string,
  originalMessage: string,
  emotionLabel: string
) {
  await sql`
    INSERT INTO pending_followups (chat_id, original_message, emotion_label)
    VALUES (${chatId}, ${originalMessage}, ${emotionLabel})
    ON CONFLICT (chat_id) DO UPDATE
      SET original_message = ${originalMessage},
          emotion_label = ${emotionLabel},
          created_at = NOW()
  `;
}

export async function getPendingFollowup(
  chatId: string
): Promise<{ original_message: string; emotion_label: string } | null> {
  const rows = await sql`
    SELECT original_message, emotion_label FROM pending_followups WHERE chat_id = ${chatId}
  `;
  return (rows[0] as { original_message: string; emotion_label: string }) ?? null;
}

export async function clearPendingFollowup(chatId: string) {
  await sql`DELETE FROM pending_followups WHERE chat_id = ${chatId}`;
}

export async function saveReflection(content: string) {
  const rows = await sql`
    INSERT INTO reflections (content) VALUES (${content}) RETURNING *
  `;
  return rows[0];
}

export async function getReflectionsSince(date: Date) {
  return sql`
    SELECT * FROM reflections
    WHERE created_at >= ${date.toISOString()}
    ORDER BY created_at ASC
  `;
}

export async function getAllReflections(limit = 50) {
  return sql`
    SELECT * FROM reflections ORDER BY created_at DESC LIMIT ${limit}
  `;
}
