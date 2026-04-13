"use server";

import { execute, queryOne } from "@/app/lib/db";
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
  const existing = await queryOne<{ id: number }>(
    "SELECT id FROM posts WHERE slug = ?", [slug]
  );
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  await execute(
    "INSERT INTO posts (title, slug, content, author_id) VALUES (?, ?, ?, ?)",
    [title, slug, content, session.id]
  );

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

  const post = await queryOne<{ slug: string }>(
    "SELECT slug FROM posts WHERE id = ?", [id]
  );
  if (!post) {
    return { error: "Post not found. It's gone. Like your patience." };
  }

  await execute(
    "UPDATE posts SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?",
    [title, content, id]
  );

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
  await execute("DELETE FROM posts WHERE id = ?", [id]);

  revalidatePath("/");
  revalidatePath("/archive");
  redirect("/admin");
}
