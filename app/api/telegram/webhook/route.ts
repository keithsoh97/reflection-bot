import { NextRequest, NextResponse } from "next/server";
import { initDb, saveReflection } from "@/lib/db";
import { sendMessage, TelegramUpdate } from "@/lib/telegram";

const OWNER_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const HELP_TEXT = `*Your Reflection Bot* 🌱

Send me anything you're proud of, grateful for, or glad about — I'll save it with today's date.

Every Wednesday at 3PM, I'll send you a summary of your week's reflections.

*Commands:*
/help — show this message
/stats — how many entries you have

Just type freely, e.g.:
_"Proud that I stayed patient with a difficult student today"_`;

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: TelegramUpdate = await req.json();
  const message = body.message;
  if (!message?.text || !message.chat) {
    return NextResponse.json({ ok: true });
  }

  const chatId = String(message.chat.id);
  const text = message.text.trim();

  if (chatId !== OWNER_CHAT_ID) {
    await sendMessage(chatId, "Sorry, this is a private bot.");
    return NextResponse.json({ ok: true });
  }

  await initDb();

  if (text === "/help" || text === "/start") {
    await sendMessage(chatId, HELP_TEXT);
    return NextResponse.json({ ok: true });
  }

  if (text === "/stats") {
    const { getAllReflections } = await import("@/lib/db");
    const all = await getAllReflections(1000);
    await sendMessage(
      chatId,
      `You have *${all.length}* reflection${all.length === 1 ? "" : "s"} logged so far. Keep going! 🌟`
    );
    return NextResponse.json({ ok: true });
  }

  if (text.startsWith("/")) {
    await sendMessage(chatId, "Unknown command. Try /help.");
    return NextResponse.json({ ok: true });
  }

  const entry = await saveReflection(text);
  const date = new Date(entry.created_at).toLocaleDateString("en-SG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  await sendMessage(
    chatId,
    `✅ Logged on *${date}*\n\n_"${text}"_\n\nThank you for recognising yourself today.`
  );

  return NextResponse.json({ ok: true });
}
