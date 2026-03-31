import { db } from "./db";

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  author_nickname?: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  nickname?: string;
  tag?: string;
}

export function getLatestPost(): Post | null {
  return (
    (db
      .prepare(
        `SELECT p.*, u.nickname as author_nickname
       FROM posts p JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC LIMIT 1`
      )
      .get() as Post | undefined) ?? null
  );
}

export function getAllPosts(): Post[] {
  return db
    .prepare(
      `SELECT p.*, u.nickname as author_nickname
     FROM posts p JOIN users u ON p.author_id = u.id
     ORDER BY p.created_at DESC`
    )
    .all() as Post[];
}

export function getPostBySlug(slug: string): Post | null {
  return (
    (db
      .prepare(
        `SELECT p.*, u.nickname as author_nickname
       FROM posts p JOIN users u ON p.author_id = u.id
       WHERE p.slug = ?`
      )
      .get(slug) as Post | undefined) ?? null
  );
}

export function getPostById(id: number): Post | null {
  return (
    (db
      .prepare(
        `SELECT p.*, u.nickname as author_nickname
       FROM posts p JOIN users u ON p.author_id = u.id
       WHERE p.id = ?`
      )
      .get(id) as Post | undefined) ?? null
  );
}

export function getComments(postId: number): Comment[] {
  return db
    .prepare(
      `SELECT c.*, u.nickname, u.tag
     FROM comments c JOIN users u ON c.user_id = u.id
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC`
    )
    .all(postId) as Comment[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
