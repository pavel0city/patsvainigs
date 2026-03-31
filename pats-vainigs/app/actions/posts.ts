"use server";

import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";
import { slugify } from "@/app/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    return { error: "A post needs words. Shocking concept." };
  }

  let slug = slugify(title);
  const existing = db
    .prepare("SELECT id FROM posts WHERE slug = ?")
    .get(slug);
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  db.prepare(
    "INSERT INTO posts (title, slug, content, author_id) VALUES (?, ?, ?, ?)"
  ).run(title, slug, content, session.id);

  revalidatePath("/");
  revalidatePath("/archive");
  redirect(`/post/${slug}`);
}

export async function updatePost(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    return { error: "A post needs words. Shocking concept." };
  }

  const post = db.prepare("SELECT slug FROM posts WHERE id = ?").get(id) as
    | { slug: string }
    | undefined;
  if (!post) {
    return { error: "Post not found. It's gone. Like your patience." };
  }

  db.prepare(
    "UPDATE posts SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, content, id);

  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath(`/post/${post.slug}`);
  redirect(`/post/${post.slug}`);
}

export async function deletePost(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Nice try." };
  }

  const id = Number(formData.get("id"));
  db.prepare("DELETE FROM posts WHERE id = ?").run(id);

  revalidatePath("/");
  revalidatePath("/archive");
  redirect("/admin");
}
