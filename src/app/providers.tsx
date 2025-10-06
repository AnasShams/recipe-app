"use client";

import { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";

type AuthContextValue = { session: Session | null };

const AuthContext = createContext<AuthContextValue>({ session: null });

export function useAuth() {
  return useContext(AuthContext);
}

export default function Providers({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    // Ensure profile exists/backfill username on client once signed in
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      const meta = (user.user_metadata || {}) as any;
      await supabase
        .from("profiles")
        .upsert({ id: user.id, username: meta.username || null, full_name: meta.full_name || null, avatar_url: meta.avatar_url || null }, { onConflict: "id" });
    })();
    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ session }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


