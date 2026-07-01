import { NextRequest, NextResponse } from "next/server";
import {
  initDb,
  saveReflection,
  getReflectionsSince,
  setPendingEmotion,
  getPendingEmotion,
  clearPendingEmotion,
  setPendingFollowup,
  getPendingFollowup,
  clearPendingFollowup,
} from "@/lib/db";
import {
  sendMessage,
  sendMessageWithButtons,
  answerCallbackQuery,
  TelegramUpdate,
} from "@/lib/telegram";
import {
  generateWeeklySummary,
  detectsEmotion,
  reflectEmotion,
} from "@/lib/claude";
import {
  EMOTION_WHEEL,
  resolveNode,
  topLevelButtons,
  childButtons,
  toRows,
} from "@/lib/emotions";

const OWNER_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const HELP_TEXT = `*Your Reflection Bot* 🌱

Send me anything you're proud of, grateful for, glad about — or how you're *feeling*. I'll save it and, if I sense an emotion, gently guide you to name it.

Every Wednesday at 3PM, I'll send you a summary of your week's reflections.

*Commands:*
/help — show this message
/stats — how many entries you have
/summary — get your weekly summary now
/feelings — start an emotional check-in anytime

Just type freely, e.g.:
_"Proud that I stayed patient with a difficult student today"_
_"Feeling really drained and I'm not sure why"_`;

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: TelegramUpdate = await req.json();

  // ── Handle inline button taps ──────────────────────────────────────────────
  if (body.callback_query) {
    const cq = body.callback_query;
    const chatId = String(cq.message.chat.id);
    const data = cq.data;

    await answerCallbackQuery(cq.id);

    if (chatId !== OWNER_CHAT_ID) return NextResponse.json({ ok: true });

    // User declined emotion exploration
    if (data === "emo:skip") {
      await sendMessage(chatId, "Got it — logged as is. 💛");
      return NextResponse.json({ ok: true });
    }

    // Emotion wheel navigation
    if (data.startsWith("emo:")) {
      const path = data.slice(4).split(":").filter(Boolean);

      // Top-level entry point — show all 8 primary emotions
      if (path.length === 0) {
        await sendMessageWithButtons(
          chatId,
          "Which of these feels closest to what you're experiencing?",
          toRows(topLevelButtons())
        );
        return NextResponse.json({ ok: true });
      }

      const node = resolveNode(path);

      if (!node) return NextResponse.json({ ok: true });

      // Leaf node — reflect back
      if (!node.children || node.children.length === 0) {
        const original = (await getPendingEmotion(chatId)) ?? "";
        await clearPendingEmotion(chatId);

        const reflection = await reflectEmotion(
          original,
          node.label,
          node.reflection ?? node.label
        );

        await setPendingFollowup(chatId, original, node.label);

        await sendMessageWithButtons(
          chatId,
          `_${node.label}_ — ${node.reflection}.\n\n${reflection}`,
          [
            [
              { text: "💬 Share more", callback_data: "followup:prompt" },
              { text: "✅ Save & done", callback_data: `save:${encodeURIComponent(original)}` },
            ],
            [{ text: "Skip for now", callback_data: "save:skip" }],
          ]
        );
        return NextResponse.json({ ok: true });
      }

      // Intermediate node — show children
      const buttons = toRows(childButtons(path, node));
      const prompt =
        path.length === 1
          ? `Within *${node.label.replace(/[^\w\s]/g, "").trim()}*, which feels closer?`
          : `Getting more specific — which resonates most?`;

      await sendMessageWithButtons(chatId, prompt, buttons);
      return NextResponse.json({ ok: true });
    }

    // User wants to share more before saving
    if (data === "followup:prompt") {
      await sendMessage(
        chatId,
        "Go ahead — share whatever's on your mind. I'm listening. 💙"
      );
      return NextResponse.json({ ok: true });
    }

    // Save reflection after emotion flow
    if (data.startsWith("save:")) {
      await clearPendingFollowup(chatId);
      const payload = data.slice(5);
      if (payload === "skip") {
        await sendMessage(chatId, "No worries. I'm here whenever you want to share. 🌿");
        return NextResponse.json({ ok: true });
      }
      await initDb();
      const textToSave = decodeURIComponent(payload);
      const entry = await saveReflection(textToSave);
      const date = new Date(entry.created_at).toLocaleDateString("en-SG", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      await sendMessage(chatId, `✅ Saved on *${date}*. Take care of yourself. 💛`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  }

  // ── Handle regular messages ────────────────────────────────────────────────
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

  if (text === "/summary") {
    await sendMessage(chatId, "Generating your summary, give me a moment... ⏳");
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const reflections = await getReflectionsSince(sevenDaysAgo);
    const summary = await generateWeeklySummary(
      reflections as { content: string; created_at: string }[]
    );
    const header = `*Your Weekly Reflection* 🌿\n_Week of ${sevenDaysAgo.toLocaleDateString("en-SG", { day: "numeric", month: "long" })} – ${new Date().toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })}_\n\n`;
    await sendMessage(chatId, header + summary);
    return NextResponse.json({ ok: true });
  }

  // Manual emotion check-in
  if (text === "/feelings") {
    await setPendingEmotion(chatId, "");
    await sendMessageWithButtons(
      chatId,
      "Let's explore what you're feeling. Which of these is closest?",
      toRows(topLevelButtons())
    );
    return NextResponse.json({ ok: true });
  }

  if (text.startsWith("/")) {
    await sendMessage(chatId, "Unknown command. Try /help.");
    return NextResponse.json({ ok: true });
  }

  // Check if user is in follow-up mode (typed after tapping "Share more")
  const followup = await getPendingFollowup(chatId);
  if (followup) {
    await clearPendingFollowup(chatId);
    const combined = `[${followup.emotion_label}] ${followup.original_message}\n\nMore context: ${text}`;
    const entry = await saveReflection(combined);
    const date = new Date(entry.created_at).toLocaleDateString("en-SG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    await sendMessage(
      chatId,
      `✅ Saved on *${date}*.\n\nThank you for sharing more — it takes courage to put words to what you feel. 💛`
    );
    return NextResponse.json({ ok: true });
  }

  // Auto-detect emotion in free-form messages
  const hasEmotion = await detectsEmotion(text);

  if (hasEmotion) {
    // Store the original message so we can use it in the reflection at the leaf
    await setPendingEmotion(chatId, text);

    await sendMessageWithButtons(
      chatId,
      `I hear you. 💙\n\nIt sounds like there's something you're feeling. Would you like to explore it a little?`,
      [
        [
          { text: "Yes, let's explore", callback_data: "emo:" },
          { text: "No, just log it", callback_data: "emo:skip" },
        ],
      ]
    );
    return NextResponse.json({ ok: true });
  }

  // Plain reflection — log as usual
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
