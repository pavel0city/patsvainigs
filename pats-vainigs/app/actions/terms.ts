"use server";

import { db } from "@/app/lib/db";
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

  const existing = db.prepare("SELECT id FROM terms WHERE LOWER(name) = LOWER(?)").get(name);
  if (existing) {
    return { error: "Term already exists." };
  }

  db.prepare("INSERT INTO terms (name, definition) VALUES (?, ?)").run(name, definition);
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

  db.prepare("UPDATE terms SET name = ?, definition = ? WHERE id = ?").run(name, definition, id);
  revalidatePath("/admin/terms");
  revalidatePath("/");
}

export async function checkTermExists(name: string): Promise<boolean> {
  const row = db.prepare("SELECT id FROM terms WHERE LOWER(name) = LOWER(?)").get(name);
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

  const existing = db.prepare("SELECT id FROM terms WHERE LOWER(name) = LOWER(?)").get(name.trim());
  if (existing) {
    return { error: "Term already exists." };
  }

  db.prepare("INSERT INTO terms (name, definition) VALUES (?, ?)").run(name.trim(), definition.trim());
  revalidatePath("/admin/terms");
  revalidatePath("/");
  return {};
}

export async function fetchAllTermNames(): Promise<{ name: string }[]> {
  return db.prepare("SELECT name FROM terms ORDER BY name ASC").all() as { name: string }[];
}

export async function deleteTerm(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const id = Number(formData.get("id"));
  db.prepare("DELETE FROM terms WHERE id = ?").run(id);
  revalidatePath("/admin/terms");
  revalidatePath("/");
}
