"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { RecipeCard, type RecipeLite } from "@/components/RecipeCard";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";

type FullRecipe = RecipeLite & { ingredients: string; steps: string; is_public?: boolean };

export default function MyRecipesPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<FullRecipe | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      const { data, error } = await supabase
        .from("recipes")
        .select("id, title, image_url")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      setRecipes((data ?? []) as any);
      setLoading(false);
    })();
  }, [router, supabase]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">My Recipes</h1>
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : recipes.length === 0 ? (
        <p className="text-slate-700 dark:text-slate-300">You have not added any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <div key={r.id} className="relative">
              <RecipeCard
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
              <div className="absolute right-2 top-2 flex gap-2">
                <button
                  className="rounded bg-white/90 px-2 py-1 text-xs text-slate-900 shadow hover:bg-white dark:bg-slate-800/90 dark:text-slate-100"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const titleNew = prompt("Edit title", r.title);
                    if (titleNew == null) return;
                    const { error } = await supabase
                      .from("recipes")
                      .update({ title: titleNew })
                      .eq("id", r.id);
                    if (!error) {
                      setRecipes((prev) => prev.map((x) => (x.id === r.id ? { ...x, title: titleNew } : x)));
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!confirm("Delete this recipe?")) return;
                    const { error } = await supabase
                      .from("recipes")
                      .delete()
                      .eq("id", r.id);
                    if (!error) {
                      setRecipes((prev) => prev.filter((x) => x.id !== r.id));
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)}>
        {active && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold">{active.title}</h2>
              <div className="flex gap-2">
                <button
                  className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700"
                  onClick={async () => {
                    // Save edits
                    const { error } = await supabase
                      .from("recipes")
                      .update({
                        title: active.title,
                        ingredients: active.ingredients,
                        steps: active.steps,
                        is_public: active.is_public ?? true,
                      })
                      .eq("id", active.id);
                    if (!error) {
                      setRecipes((prev) => prev.map((x) => (x.id === active.id ? { id: x.id, title: active.title, image_url: active.image_url } : x)));
                    }
                  }}
                >
                  Save
                </button>
                <button
                  className="rounded bg-slate-200 px-3 py-1 text-sm font-medium text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Ingredients</h3>
                <textarea
                  className="h-40 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  value={active.ingredients}
                  onChange={(e) => setActive({ ...active, ingredients: e.target.value })}
                />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Steps</h3>
                <textarea
                  className="h-40 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  value={active.steps}
                  onChange={(e) => setActive({ ...active, steps: e.target.value })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={!!active.is_public}
                onChange={(e) => setActive({ ...active, is_public: e.target.checked })}
              />
              Make public
            </label>
          </div>
        )}
      </Modal>
    </main>
  );
}


