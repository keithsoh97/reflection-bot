import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Returns true if the message is expressing an emotional state (not just logging a fact/achievement)
export async function detectsEmotion(text: string): Promise<boolean> {
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 10,
    messages: [
      {
        role: "user",
        content: `Does this message express an emotional feeling or inner state? Reply only "yes" or "no".\n\nMessage: "${text}"`,
      },
    ],
  });
  const block = msg.content[0];
  const answer = block.type === "text" ? block.text.trim().toLowerCase() : "";
  return answer.startsWith("yes");
}

export async function reflectEmotion(
  originalMessage: string,
  emotionLabel: string,
  emotionReflection: string
): Promise<string> {
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 180,
    messages: [
      {
        role: "user",
        content: `You are a warm, empathetic companion. The user shared this message: "${originalMessage}"\n\nThey've identified what they're feeling as: ${emotionLabel} — described as "${emotionReflection}".\n\nWrite 2–3 sentences that:\n1. Gently validate and name what they're feeling\n2. Acknowledge something specific from their message\n3. End with a short, open question that invites them to go deeper — not generic\n\nTone: like a caring friend, not a therapist. Plain text only.`,
      },
    ],
  });
  const block = msg.content[0];
  return block.type === "text" ? block.text : "Thank you for sharing that with me.";
}

type Reflection = { content: string; created_at: string };

export async function generateWeeklySummary(
  reflections: Reflection[]
): Promise<string> {
  if (reflections.length === 0) {
    return "No reflections logged this week. Start small — even one thing you're proud of counts. 💛";
  }

  const entriesList = reflections
    .map((r) => {
      const date = new Date(r.created_at).toLocaleDateString("en-SG", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      return `[${date}] ${r.content}`;
    })
    .join("\n");

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are a compassionate reflection companion reviewing someone's personal wins and gratitudes from the past week.

Here are their entries:
${entriesList}

Write a warm weekly reflection summary following these rules:
1. Do NOT just list or rephrase their entries back at them
2. Identify 2–3 underlying themes or strengths that emerge across the entries (e.g. resilience, care for others, discipline)
3. Write a short second-person narrative (150–180 words) that celebrates who they've shown up as this week — speak to their character, not just their actions
4. End with ONE thoughtful question for them to carry into the next week (not generic — tie it to their specific entries)

Tone: warm, genuine, grounded — like a trusted friend, not a corporate motivational poster.
Format: plain text only, no bullet points or headers. Start directly with the narrative.`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "Unable to generate summary.";
}
