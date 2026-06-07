import { NextRequest, NextResponse } from "next/server";
import { getReflectionsSince } from "@/lib/db";
import { generateWeeklySummary } from "@/lib/claude";
import { sendMessage } from "@/lib/telegram";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const reflections = await getReflectionsSince(sevenDaysAgo);
  const summary = await generateWeeklySummary(
    reflections as { content: string; created_at: string }[]
  );

  const header = `*Your Weekly Reflection* 🌿\n_Week of ${sevenDaysAgo.toLocaleDateString("en-SG", { day: "numeric", month: "long" })} – ${new Date().toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}_\n\n`;

  await sendMessage(process.env.TELEGRAM_CHAT_ID!, header + summary);

  return NextResponse.json({ ok: true, entries: reflections.length });
}
