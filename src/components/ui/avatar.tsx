"use client";

import Image from "next/image";

export function Avatar({ src, name, size = 32 }: { src?: string | null; name?: string | null; size?: number }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const dimension = `${size}px`;
  return (
    <div
      className="inline-flex select-none items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
      style={{ width: dimension, height: dimension }}
      aria-label={name || "avatar"}
    >
      {src ? (
        <Image src={src} alt={name || "avatar"} width={size} height={size} className="object-cover" />
      ) : (
        <span className="text-xs font-medium">{initials}</span>
      )}
    </div>
  );
}



