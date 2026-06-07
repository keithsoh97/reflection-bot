import { getAllReflections } from "@/lib/db";

export const dynamic = "force-dynamic";

type Reflection = {
  id: number;
  content: string;
  created_at: string;
};

export default async function Home() {
  let reflections: Reflection[] = [];
  try {
    reflections = (await getAllReflections(100)) as Reflection[];
  } catch {
    // DB not yet initialized
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">
            Your Reflections
          </h1>
          <p className="text-stone-500 text-sm">
            Logged via your Telegram bot · {reflections.length} entr
            {reflections.length === 1 ? "y" : "ies"}
          </p>
        </div>

        {reflections.length === 0 ? (
          <div className="text-center text-stone-400 mt-20">
            <p className="text-4xl mb-4">🌱</p>
            <p>No reflections yet.</p>
            <p className="text-sm mt-1">
              Send a message to your Telegram bot to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {reflections.map((r) => (
              <li
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl px-5 py-4"
              >
                <p className="text-stone-700 leading-relaxed">{r.content}</p>
                <p className="text-stone-400 text-xs mt-2">
                  {new Date(r.created_at).toLocaleDateString("en-SG", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
