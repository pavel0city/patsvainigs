"use server";

import { execute, query } from "@/app/lib/db";
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
  return query<UserRow>(
    "SELECT id, username, nickname, tag, role, created_at FROM users ORDER BY created_at DESC"
  );
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

  await execute(
    "UPDATE users SET nickname = ?, tag = ?, role = ? WHERE id = ?",
    [nickname, tag, role, id]
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

  await execute("DELETE FROM comments WHERE user_id = ?", [id]);
  await execute("DELETE FROM users WHERE id = ?", [id]);
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

  await execute(
    "UPDATE users SET nickname = ?, tag = ? WHERE id = ?",
    [nickname, tag, session.id]
  );

  revalidatePath("/");
}
