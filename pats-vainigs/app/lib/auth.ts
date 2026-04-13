import { cookies } from "next/headers";
import { queryOne } from "./db";

export interface SessionUser {
  id: number;
  username: string;
  nickname: string;
  tag: string;
  role: "admin" | "user";
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) return null;

  return queryOne<SessionUser>(
    "SELECT id, username, nickname, tag, role FROM users WHERE id = ?",
    [Number(sessionId)]
  );
}

export async function setSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set("session", String(userId), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
