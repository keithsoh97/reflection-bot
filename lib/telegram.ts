const BASE = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export type InlineButton = { text: string; callback_data: string };

export async function sendMessage(chatId: string, text: string) {
  const res = await fetch(`${BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram sendMessage failed: ${err}`);
  }
  return res.json();
}

export async function sendMessageWithButtons(
  chatId: string,
  text: string,
  buttons: InlineButton[][]
) {
  const res = await fetch(`${BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram sendMessageWithButtons failed: ${err}`);
  }
  return res.json();
}

export async function answerCallbackQuery(callbackQueryId: string) {
  await fetch(`${BASE}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  });
}

export async function setWebhook(webhookUrl: string) {
  const res = await fetch(`${BASE}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    }),
  });
  return res.json();
}

export type TelegramUpdate = {
  message?: {
    chat: { id: number };
    from?: { first_name: string };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: { id: number };
    message: { chat: { id: number } };
    data: string;
  };
};
