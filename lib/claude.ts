import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
