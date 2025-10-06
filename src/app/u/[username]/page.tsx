"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { RecipeCard, type RecipeLite } from "@/components/RecipeCard";
import { useParams } from "next/navigation";
import { Modal } from "@/components/ui/modal";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export default function PublicProfilePage() {
  const supabase = getSupabaseBrowserClient();
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recipes, setRecipes] = useState<RecipeLite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<any>(null);

  useEffect(() => {
    (async () => {
      // Try exact username first
      let { data: prof, error: e1 } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .eq("username", username)
        .maybeSingle();
      // If not found, try case-insensitive partial match on username and full_name
      if (!prof) {
        const { data: list } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url")
          .or(`username.ilike.%${username}%,full_name.ilike.%${username}%`)
          .limit(1);
        prof = list?.[0] as any;
      }
      if (e1) return setError(e1.message);
      if (!prof) return setError("User not found");
      setProfile(prof as any);
      const { data: recs, error: e2 } = await supabase
        .from("recipes")
        .select("id, title, image_url")
        .eq("user_id", prof.id)
        .eq("is_public", true)
        .order("created_at", { ascending: false });
      if (e2) return setError(e2.message);
      setRecipes((recs ?? []) as any);
    })();
  }, [supabase, username]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : !profile ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{profile.username}</h1>
            {profile.full_name && (
              <p className="text-slate-600 dark:text-slate-300">{profile.full_name}</p>
            )}
          </div>
          {recipes.length === 0 ? (
            <p>No public recipes.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    if (data) setActive(data);
                  }}
                />
              ))}
            </div>
          )}
        </>
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
                <ul className="list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                  {(active.ingredients?.split("\n") ?? []).filter(Boolean).map((i: string, idx: number) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Steps</h3>
                <ol className="list-decimal space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                  {(active.steps?.split("\n") ?? []).filter(Boolean).map((s: string, idx: number) => (
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


