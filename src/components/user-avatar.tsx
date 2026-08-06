"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

/** Loosely typed to match Supabase's `User` shape without depending on `@supabase/supabase-js`. */
export type SupabaseUserLike =
  | {
      email?: string | null;
      user_metadata?: Record<string, unknown> | null;
      identities?: Array<{
        identity_data?: Record<string, unknown> | null;
      }> | null;
    }
  | null
  | undefined;

/** First letter of the name, uppercased. Falls back to "?" when there's nothing usable. */
export function getInitials(name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

/**
 * Resolves a display name off a raw Supabase user object, checking the OAuth
 * metadata keys Google/etc. populate before falling back to the email.
 */
export function resolveSupabaseDisplayName(
  user: SupabaseUserLike,
): string | undefined {
  const metadata = user?.user_metadata;
  for (const key of [
    "full_name",
    "name",
    "preferred_username",
    "nickname",
    "user_name",
  ]) {
    const value = metadata?.[key];
    if (typeof value === "string" && value) return value;
  }
  return user?.email ?? undefined;
}

/** Resolves an avatar image URL off a raw Supabase user object. */
export function resolveSupabaseAvatarUrl(
  user: SupabaseUserLike,
): string | undefined {
  const metadata = user?.user_metadata;
  const fromMetadata = metadata?.avatar_url ?? metadata?.picture;
  if (typeof fromMetadata === "string" && fromMetadata) return fromMetadata;
  const fromIdentity = user?.identities?.[0]?.identity_data?.avatar_url;
  return typeof fromIdentity === "string" ? fromIdentity : undefined;
}

export type UserAvatarProps = {
  name?: string | null;
  imageUrl?: string | null;
} & Omit<React.ComponentPropsWithoutRef<typeof Avatar>, "children">;

/**
 * Logged-in-user avatar: real photo when available, first-letter-initial
 * fallback otherwise. Generalized from credbox/janmat's identical
 * `getInitials`+`Avatar` pattern, which had independently drifted from
 * jalkhata's and sportik's own versions before this existed.
 */
export function UserAvatar({ name, imageUrl, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={name ?? "User"} /> : null}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
