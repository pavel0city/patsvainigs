"use server";

import { execute, queryOne, query } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTerm(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const definition = String(formData.get("definition") ?? "").trim();

  if (!name || !definition) {
    return { error: "Both fields required." };
  }

  const existing = await queryOne<{ id: number }>(
    "SELECT id FROM terms WHERE LOWER(name) = LOWER(?)", [name]
  );
  if (existing) {
    return { error: "Term already exists." };
  }

  await execute("INSERT INTO terms (name, definition) VALUES (?, ?)", [name, definition]);
  revalidatePath("/admin/terms");
  revalidatePath("/");
}

export async function updateTerm(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const definition = String(formData.get("definition") ?? "").trim();

  if (!name || !definition) {
    return { error: "Both fields required." };
  }

  await execute("UPDATE terms SET name = ?, definition = ? WHERE id = ?", [name, definition, id]);
  revalidatePath("/admin/terms");
  revalidatePath("/");
}

export async function checkTermExists(name: string): Promise<boolean> {
  const row = await queryOne<{ id: number }>(
    "SELECT id FROM terms WHERE LOWER(name) = LOWER(?)", [name]
  );
  return !!row;
}

export async function quickCreateTerm(name: string, definition: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  if (!name.trim() || !definition.trim()) {
    return { error: "Both fields required." };
  }

  const existing = await queryOne<{ id: number }>(
    "SELECT id FROM terms WHERE LOWER(name) = LOWER(?)", [name.trim()]
  );
  if (existing) {
    return { error: "Term already exists." };
  }

  await execute("INSERT INTO terms (name, definition) VALUES (?, ?)", [name.trim(), definition.trim()]);
  revalidatePath("/admin/terms");
  revalidatePath("/");
  return {};
}

export async function fetchAllTermNames(): Promise<{ name: string }[]> {
  return query<{ name: string }>("SELECT name FROM terms ORDER BY name ASC");
}

export async function deleteTerm(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const id = Number(formData.get("id"));
  await execute("DELETE FROM terms WHERE id = ?", [id]);
  revalidatePath("/admin/terms");
  revalidatePath("/");
}
