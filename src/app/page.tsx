"use client";

import { useEffect, useMemo, useState } from "react";
import { RecipeCard, type RecipeLite } from "@/components/RecipeCard";
import { Modal } from "@/components/ui/modal";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type FullRecipe = RecipeLite & { ingredients: string; steps: string };

export default function Home() {
  const supabase = getSupabaseBrowserClient();
  const [recipes, setRecipes] = useState<RecipeLite[]>([]);
  const [active, setActive] = useState<FullRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, image_url")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(36);
      if (error) setError(error.message);
      setRecipes((data ?? []) as any);
      setLoading(false);
    })();
  }, [supabase]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-10">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-[1px]">
          <div className="rounded-2xl bg-white p-6 dark:bg-slate-950">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Food Recipe App</h1>
            <p className="text-slate-600 dark:text-slate-300">Browse public recipes or sign in to save yours.</p>
          </div>
        </div>
      </header>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onClick={async () => {
                const { data } = await supabase
                  .from("recipes")
                  .select("id, title, image_url, ingredients, steps")
                  .eq("id", r.id)
                  .maybeSingle();
                if (data) setActive(data as any);
              }}
            />
          ))}
        </section>
      )}

      <Modal open={!!active} onClose={() => setActive(null)}>
        {active && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold">{active.title}</h2>
              <button className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Ingredients</h3>
                <ul className="list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
                  {(active.ingredients?.split("\n") ?? []).filter(Boolean).map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Steps</h3>
                <ol className="list-decimal space-y-1 pl-5 text-gray-700 dark:text-gray-300">
                  {(active.steps?.split("\n") ?? []).filter(Boolean).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
