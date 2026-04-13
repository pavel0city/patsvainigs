"use server";

import { execute, queryOne } from "@/app/lib/db";
import { setSession, clearSession } from "@/app/lib/auth";
import { hashSync, compareSync } from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !nickname || !password) {
    return { error: "All fields are required. Obviously." };
  }

  if (password.length < 4) {
    return { error: "Password too short. Even we have standards." };
  }

  const existing = await queryOne<{ id: number }>(
    "SELECT id FROM users WHERE username = ?", [username]
  );
  if (existing) {
    return { error: "Username taken. You're not that original." };
  }

  const hash = hashSync(password, 10);
  const result = await execute(
    "INSERT INTO users (username, nickname, tag, password_hash) VALUES (?, ?, ?, ?)",
    [username, nickname, tag, hash]
  );

  await setSession(Number(result.lastInsertRowid));
  redirect("/");
}

export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Fill in the fields. It's not that hard." };
  }

  const user = await queryOne<{ id: number; password_hash: string }>(
    "SELECT id, password_hash FROM users WHERE username = ?", [username]
  );

  if (!user || !compareSync(password, user.password_hash)) {
    return { error: "Wrong credentials. Pats vainīgs." };
  }

  await setSession(user.id);
  redirect("/");
}

export async function logout() {
  await clearSession();
  redirect("/");
}
