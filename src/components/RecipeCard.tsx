"use client";

import Image from "next/image";

export type RecipeLite = {
  id: string;
  title: string;
  image_url?: string | null;
};

export function RecipeCard({ recipe, onClick }: { recipe: RecipeLite; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow transition hover:shadow-lg focus:outline-none dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative aspect-video w-full bg-gray-100">
        {recipe.image_url ? (
          <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover transition group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div className="p-3 font-medium text-slate-900 dark:text-slate-100">
        <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
          {recipe.title}
        </span>
      </div>
    </button>
  );
}


