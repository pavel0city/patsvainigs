"use server";

import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

export interface UserRow {
  id: number;
  username: string;
  nickname: string;
  tag: string;
  role: string;
  created_at: string;
}

export async function getAllUsers(): Promise<UserRow[]> {
  return db
    .prepare("SELECT id, username, nickname, tag, role, created_at FROM users ORDER BY created_at DESC")
    .all() as UserRow[];
}

export async function updateUser(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const id = Number(formData.get("id"));
  const nickname = String(formData.get("nickname") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();
  const role = String(formData.get("role") ?? "user");

  if (!nickname) {
    return { error: "Nickname required. Anonymous is taken." };
  }

  db.prepare("UPDATE users SET nickname = ?, tag = ?, role = ? WHERE id = ?").run(
    nickname,
    tag,
    role,
    id
  );

  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const id = Number(formData.get("id"));
  if (id === session.id) {
    return { error: "Can't delete yourself. That's a different kind of problem." };
  }

  db.prepare("DELETE FROM comments WHERE user_id = ?").run(id);
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  revalidatePath("/admin/users");
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not logged in." };

  const nickname = String(formData.get("nickname") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();

  if (!nickname) {
    return { error: "You need a name. Even a fake one." };
  }

  db.prepare("UPDATE users SET nickname = ?, tag = ? WHERE id = ?").run(
    nickname,
    tag,
    session.id
  );

  revalidatePath("/");
}
