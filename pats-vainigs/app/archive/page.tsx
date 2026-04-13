import { getAllPosts } from "@/app/lib/posts";
import Link from "next/link";

export const metadata = {
  title: "kādreiz sasāpējās | pats vainīgs",
};

export default async function Archive() {
  const posts = await getAllPosts();

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h2>the archive is empty.</h2>
        <p>no history of complaints. yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">archive</h1>
      <ul className="archive-list">
        {posts.map((post) => {
          const date = new Date(post.created_at + "Z").toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          );
          return (
            <li key={post.id} className="archive-item">
              <Link href={`/post/${post.slug}`}>
                <div className="archive-title">{post.title}</div>
                <div className="archive-meta">
                  {date} / {post.author_nickname}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
