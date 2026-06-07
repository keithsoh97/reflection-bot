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
