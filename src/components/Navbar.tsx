"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export function Navbar() {
  const { session } = useAuth();
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-slate-900 dark:text-slate-100">
        <Link href="/" className="font-semibold tracking-tight">
          FoodRecipe
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link className="text-sm hover:underline" href="/my">
                My Recipes
              </Link>
              <Link className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700" href="/add">
                Add Recipe
              </Link>
              <ProfileDropdown />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="rounded bg-emerald-600 px-3 py-1 text-sm font-semibold text-white ring-1 ring-emerald-700/30 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-white" href="/auth">
                Sign in
              </Link>
              <Link className="rounded border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" href="/auth?mode=signup">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { session } = useAuth();
  const user = session?.user;
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-sm text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        <Avatar src={(user?.user_metadata as any)?.avatar_url} name={(user?.user_metadata as any)?.username || user?.email} />
        <span className="hidden sm:inline">{(user?.user_metadata as any)?.username || user?.email}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white p-1 text-sm shadow-md dark:border-slate-700 dark:bg-slate-900">
          <Link href="/settings" className="block rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            Settings
          </Link>
          <button
            className="block w-full rounded px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={async () => {
              const s = getSupabaseBrowserClient();
              await s.auth.signOut();
              window.location.href = "/";
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}


