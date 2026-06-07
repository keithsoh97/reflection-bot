import { NextRequest, NextResponse } from "next/server";
import { initDb } from "@/lib/db";
import { setWebhook } from "@/lib/telegram";

// One-time setup endpoint — run after first deploy
// GET /api/setup?secret=YOUR_CRON_SECRET
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await initDb();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const webhookUrl = `${appUrl}/api/telegram/webhook`;
  const result = await setWebhook(webhookUrl);

  return NextResponse.json({ db: "initialized", webhook: result });
}
