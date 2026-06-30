// Plutchik-based emotion wheel tree
// callback_data format: "emo:<path>" where path is colon-joined slugs
// e.g. "emo:joy" → "emo:joy:serenity" | "emo:joy:joy" | "emo:joy:ecstasy"

export type EmotionNode = {
  label: string;
  slug: string;
  reflection?: string; // shown when this is a leaf — what to say back
  children?: EmotionNode[];
};

export const EMOTION_WHEEL: EmotionNode[] = [
  {
    label: "😊 Joy", slug: "joy",
    children: [
      { label: "Serenity", slug: "serenity", reflection: "a quiet, peaceful contentment" },
      { label: "Joy", slug: "joy2", reflection: "genuine happiness and warmth" },
      { label: "Ecstasy", slug: "ecstasy", reflection: "an intense, overwhelming elation" },
    ],
  },
  {
    label: "😟 Sadness", slug: "sadness",
    children: [
      { label: "Pensiveness", slug: "pensiveness", reflection: "a gentle, reflective melancholy" },
      { label: "Sadness", slug: "sadness2", reflection: "a heavy, deep sorrow" },
      { label: "Grief", slug: "grief", reflection: "profound loss and heartache" },
    ],
  },
  {
    label: "😠 Anger", slug: "anger",
    children: [
      { label: "Annoyance", slug: "annoyance", reflection: "a nagging irritation under the surface" },
      { label: "Anger", slug: "anger2", reflection: "a sharp, burning frustration" },
      { label: "Rage", slug: "rage", reflection: "an intense, overwhelming fury" },
    ],
  },
  {
    label: "😨 Fear", slug: "fear",
    children: [
      { label: "Apprehension", slug: "apprehension", reflection: "a quiet unease about what's ahead" },
      { label: "Fear", slug: "fear2", reflection: "a strong sense of dread or threat" },
      { label: "Terror", slug: "terror", reflection: "an overwhelming, paralyzing fear" },
    ],
  },
  {
    label: "🤢 Disgust", slug: "disgust",
    children: [
      { label: "Boredom", slug: "boredom", reflection: "a dull, disengaged flatness" },
      { label: "Disgust", slug: "disgust2", reflection: "a strong sense of repulsion or wrongness" },
      { label: "Loathing", slug: "loathing", reflection: "a deep, visceral aversion" },
    ],
  },
  {
    label: "😲 Surprise", slug: "surprise",
    children: [
      { label: "Distraction", slug: "distraction", reflection: "feeling caught off-guard or scattered" },
      { label: "Surprise", slug: "surprise2", reflection: "a sudden jolt of the unexpected" },
      { label: "Amazement", slug: "amazement", reflection: "stunned awe at something remarkable" },
    ],
  },
  {
    label: "🤝 Trust", slug: "trust",
    children: [
      { label: "Acceptance", slug: "acceptance", reflection: "a gentle openness and okayness" },
      { label: "Trust", slug: "trust2", reflection: "a solid sense of safety and confidence" },
      { label: "Admiration", slug: "admiration", reflection: "deep appreciation and respect" },
    ],
  },
  {
    label: "🌱 Anticipation", slug: "anticipation",
    children: [
      { label: "Interest", slug: "interest", reflection: "a curious, engaged pull toward something" },
      { label: "Anticipation", slug: "anticipation2", reflection: "an eager, forward-leaning energy" },
      { label: "Vigilance", slug: "vigilance", reflection: "a tense, alert readiness" },
    ],
  },
];

export function resolveNode(path: string[]): EmotionNode | null {
  let nodes: EmotionNode[] = EMOTION_WHEEL;
  let node: EmotionNode | null = null;
  for (const slug of path) {
    const found = nodes.find((n) => n.slug === slug);
    if (!found) return null;
    node = found;
    nodes = found.children ?? [];
  }
  return node;
}

export function topLevelButtons() {
  return EMOTION_WHEEL.map((e) => ({
    text: e.label,
    callback_data: `emo:${e.slug}`,
  }));
}

export function childButtons(path: string[], node: EmotionNode) {
  return (node.children ?? []).map((c) => ({
    text: c.label,
    callback_data: `emo:${[...path, c.slug].join(":")}`,
  }));
}

// chunk buttons into rows of 2
export function toRows<T>(items: T[], perRow = 2): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  return rows;
}
