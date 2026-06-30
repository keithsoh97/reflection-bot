// Emotion wheel based on the 6-primary colour wheel (Happy / Sad / Angry / Fearful / Disgusted / Surprised)
// 3 levels: primary → secondary → tertiary (leaf)
// callback_data format: "emo:<slug1>:<slug2>:<slug3>"

export type EmotionNode = {
  label: string;
  slug: string;
  reflection?: string; // only on leaves
  children?: EmotionNode[];
};

export const EMOTION_WHEEL: EmotionNode[] = [
  {
    label: "😊 Happy", slug: "happy",
    children: [
      {
        label: "Optimistic", slug: "optimistic",
        children: [
          { label: "Hopeful", slug: "hopeful", reflection: "a gentle, forward-looking hope" },
          { label: "Inspired", slug: "inspired", reflection: "a spark of inspiration and possibility" },
        ],
      },
      {
        label: "Peaceful", slug: "peaceful",
        children: [
          { label: "Loved", slug: "loved", reflection: "a warm, deep sense of being loved" },
          { label: "Thankful", slug: "thankful", reflection: "a quiet, heartfelt gratitude" },
        ],
      },
      {
        label: "Powerful", slug: "powerful",
        children: [
          { label: "Courageous", slug: "courageous", reflection: "a bold, grounded courage" },
          { label: "Creative", slug: "creative", reflection: "an expansive, energised creativity" },
        ],
      },
      {
        label: "Excited", slug: "excited",
        children: [
          { label: "Eager", slug: "eager", reflection: "a keen, restless eagerness" },
          { label: "Energetic", slug: "energetic", reflection: "a vibrant, buzzing energy" },
        ],
      },
      {
        label: "Proud", slug: "proud",
        children: [
          { label: "Successful", slug: "successful", reflection: "a satisfying sense of achievement" },
          { label: "Confident", slug: "confident", reflection: "a steady, solid self-assurance" },
        ],
      },
    ],
  },
  {
    label: "😢 Sad", slug: "sad",
    children: [
      {
        label: "Lonely", slug: "lonely",
        children: [
          { label: "Isolated", slug: "isolated", reflection: "a painful sense of being cut off" },
          { label: "Abandoned", slug: "abandoned", reflection: "a deep ache of feeling left behind" },
        ],
      },
      {
        label: "Vulnerable", slug: "vulnerable",
        children: [
          { label: "Fragile", slug: "fragile", reflection: "a tender, exposed fragility" },
          { label: "Victimised", slug: "victimised", reflection: "a raw feeling of being wronged" },
        ],
      },
      {
        label: "Despair", slug: "despair",
        children: [
          { label: "Grief", slug: "grief", reflection: "a profound, heavy grief" },
          { label: "Powerless", slug: "powerless", reflection: "a draining sense of helplessness" },
        ],
      },
      {
        label: "Guilty", slug: "guilty",
        children: [
          { label: "Ashamed", slug: "ashamed", reflection: "a burning shame turned inward" },
          { label: "Remorseful", slug: "remorseful", reflection: "a sincere, aching remorse" },
        ],
      },
      {
        label: "Hurt", slug: "hurt",
        children: [
          { label: "Disappointed", slug: "disappointed", reflection: "a hollow disappointment in how things went" },
          { label: "Wounded", slug: "wounded", reflection: "a deep, personal sting of hurt" },
        ],
      },
    ],
  },
  {
    label: "😠 Angry", slug: "angry",
    children: [
      {
        label: "Humiliated", slug: "humiliated",
        children: [
          { label: "Disrespected", slug: "disrespected", reflection: "a sharp sting of being disrespected" },
          { label: "Ridiculed", slug: "ridiculed", reflection: "a burning feeling of being mocked" },
        ],
      },
      {
        label: "Bitter", slug: "bitter",
        children: [
          { label: "Indignant", slug: "indignant", reflection: "a righteous, simmering indignation" },
          { label: "Violated", slug: "violated", reflection: "a sense that something sacred was crossed" },
        ],
      },
      {
        label: "Frustrated", slug: "frustrated",
        children: [
          { label: "Annoyed", slug: "annoyed", reflection: "a nagging, persistent irritation" },
          { label: "Infuriated", slug: "infuriated", reflection: "a fierce, white-hot fury" },
        ],
      },
      {
        label: "Critical", slug: "critical",
        children: [
          { label: "Sceptical", slug: "sceptical", reflection: "a guarded, doubtful wariness" },
          { label: "Dismissive", slug: "dismissive", reflection: "a cold, shutting-down feeling" },
        ],
      },
      {
        label: "Distant", slug: "distant",
        children: [
          { label: "Withdrawn", slug: "withdrawn", reflection: "a quiet pulling-away from the world" },
          { label: "Numb", slug: "numb", reflection: "a hollow, muted numbness" },
        ],
      },
    ],
  },
  {
    label: "😨 Fearful", slug: "fearful",
    children: [
      {
        label: "Threatened", slug: "threatened",
        children: [
          { label: "Nervous", slug: "nervous", reflection: "a jittery, on-edge nervousness" },
          { label: "Exposed", slug: "exposed", reflection: "a vulnerable feeling of being seen and unsafe" },
        ],
      },
      {
        label: "Rejected", slug: "rejected",
        children: [
          { label: "Excluded", slug: "excluded", reflection: "a painful sense of being left out" },
          { label: "Persecuted", slug: "persecuted", reflection: "a heavy feeling of being unfairly targeted" },
        ],
      },
      {
        label: "Weak", slug: "weak",
        children: [
          { label: "Worthless", slug: "worthless", reflection: "a crushing sense of not being enough" },
          { label: "Insignificant", slug: "insignificant", reflection: "a small, invisible kind of hurt" },
        ],
      },
      {
        label: "Insecure", slug: "insecure",
        children: [
          { label: "Inadequate", slug: "inadequate", reflection: "a gnawing doubt in your own capacity" },
          { label: "Inferior", slug: "inferior", reflection: "a painful comparison that leaves you feeling less-than" },
        ],
      },
      {
        label: "Anxious", slug: "anxious",
        children: [
          { label: "Overwhelmed", slug: "overwhelmed", reflection: "a flooding, too-much-at-once overwhelm" },
          { label: "Worried", slug: "worried", reflection: "a restless, circling worry" },
        ],
      },
    ],
  },
  {
    label: "🤢 Disgusted", slug: "disgusted",
    children: [
      {
        label: "Repelled", slug: "repelled",
        children: [
          { label: "Horrified", slug: "horrified", reflection: "a visceral, shocked horror" },
          { label: "Hesitant", slug: "hesitant", reflection: "a reluctant, holding-back unease" },
        ],
      },
      {
        label: "Awful", slug: "awful",
        children: [
          { label: "Nauseated", slug: "nauseated", reflection: "a gut-turning, sickening feeling" },
          { label: "Detestable", slug: "detestable", reflection: "a deep revulsion at something" },
        ],
      },
      {
        label: "Disapproving", slug: "disapproving",
        children: [
          { label: "Judgemental", slug: "judgemental", reflection: "a sharp, critical inner verdict" },
          { label: "Embarrassed", slug: "embarrassed", reflection: "a hot-cheeked, cringing embarrassment" },
        ],
      },
      {
        label: "Disenchanted", slug: "disenchanted",
        children: [
          { label: "Appalled", slug: "appalled", reflection: "a stunned disbelief that something could happen" },
          { label: "Revolted", slug: "revolted", reflection: "a strong, recoiling revulsion" },
        ],
      },
      {
        label: "Startled", slug: "startled",
        children: [
          { label: "Shocked", slug: "shocked", reflection: "a jolting, can't-believe-it shock" },
          { label: "Dismayed", slug: "dismayed", reflection: "a sinking, deflating dismay" },
        ],
      },
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

export function toRows<T>(items: T[], perRow = 2): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  return rows;
}
