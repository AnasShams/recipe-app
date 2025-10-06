// "use client";

// import { useEffect, useState } from "react";
// import { getSupabaseBrowserClient } from "@/lib/supabase/client";
// import { RecipeCard, type RecipeLite } from "@/components/RecipeCard";
// import { useRouter } from "next/navigation";

// export default function ExplorePage() {
//   const supabase = getSupabaseBrowserClient();
//   const router = useRouter();
//   const [recipes, setRecipes] = useState<RecipeLite[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     (async () => {
//       const { data, error } = await supabase
//         .from("recipes")
//         .select("id, title, image_url")
//         .eq("is_public", true)
//         .order("created_at", { ascending: false })
//         .limit(36);
//       if (error) setError(error.message);
//       setRecipes((data ?? []) as any);
//       setLoading(false);
//     })();
//   }, [supabase]);

//   return (
//     <main className="mx-auto max-w-6xl px-4 py-8">
//       <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">Explore Public Recipes</h1>
//       <form
//         className="mb-6 flex gap-2"
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (search.trim()) router.push(`/u/${encodeURIComponent(search.trim())}`);
//         }}
//       >
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by username…"
//           className="w-full max-w-sm rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
//         />
//         <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">Search</button>
//       </form>
//       {loading ? (
//         <p>Loading…</p>
//       ) : error ? (
//         <p className="text-red-600">{error}</p>
//       ) : recipes.length === 0 ? (
//         <p>No public recipes yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {recipes.map((r) => (
//             <RecipeCard key={r.id} recipe={r} onClick={() => {}} />
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }


