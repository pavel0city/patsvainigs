"use server";

import { db } from "@/app/lib/db";
import { getSession } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

export async function addComment(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Log in first. We need to know who to blame." };
  }

  const postId = Number(formData.get("postId"));
  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    return { error: "Empty thoughts? Keep them to yourself." };
  }

  const post = db.prepare("SELECT slug FROM posts WHERE id = ?").get(postId) as
    | { slug: string }
    | undefined;
  if (!post) {
    return { error: "Post doesn't exist. Much like your argument." };
  }

  db.prepare(
    "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)"
  ).run(postId, session.id, content);

  revalidatePath(`/post/${post.slug}`);
}

export async function deleteComment(formData: FormData) {
  const session = await getSession();
  if (!session) return;

  const commentId = Number(formData.get("commentId"));
  const comment = db
    .prepare("SELECT c.user_id, p.slug FROM comments c JOIN posts p ON c.post_id = p.id WHERE c.id = ?")
    .get(commentId) as { user_id: number; slug: string } | undefined;

  if (!comment) return;
  if (session.role !== "admin" && session.id !== comment.user_id) return;

  db.prepare("DELETE FROM comments WHERE id = ?").run(commentId);
  revalidatePath(`/post/${comment.slug}`);
}
