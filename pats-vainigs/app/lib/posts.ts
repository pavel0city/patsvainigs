import { query, queryOne } from "./db";

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

export async function getLatestPost(): Promise<Post | null> {
  return queryOne<Post>(
    `SELECT p.*, u.nickname as author_nickname
     FROM posts p JOIN users u ON p.author_id = u.id
     ORDER BY p.created_at DESC LIMIT 1`
  );
}

export async function getAllPosts(): Promise<Post[]> {
  return query<Post>(
    `SELECT p.*, u.nickname as author_nickname
     FROM posts p JOIN users u ON p.author_id = u.id
     ORDER BY p.created_at DESC`
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return queryOne<Post>(
    `SELECT p.*, u.nickname as author_nickname
     FROM posts p JOIN users u ON p.author_id = u.id
     WHERE p.slug = ?`,
    [slug]
  );
}

export async function getPostById(id: number): Promise<Post | null> {
  return queryOne<Post>(
    `SELECT p.*, u.nickname as author_nickname
     FROM posts p JOIN users u ON p.author_id = u.id
     WHERE p.id = ?`,
    [id]
  );
}

export async function getComments(postId: number): Promise<Comment[]> {
  return query<Comment>(
    `SELECT c.*, u.nickname, u.tag
     FROM comments c JOIN users u ON c.user_id = u.id
     WHERE c.post_id = ?
     ORDER BY c.created_at ASC`,
    [postId]
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
