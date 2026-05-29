import { cookies } from "next/headers";
import { cache } from "react";
import { validateSessionAndGetUser } from "./use-cases/session";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  const data = await validateSessionAndGetUser(session);

  return data?.user ?? null;
});
