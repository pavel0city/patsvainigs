import { getLatestPost } from "./lib/posts";
import PostView from "./ui/post-view";
import { getComments } from "./lib/posts";
import CommentSection from "./ui/comment-section";
import Link from "next/link";

export default async function Home() {
  const post = await getLatestPost();

  if (!post) {
    return (
      <div className="empty-state">
        <h2>te nekā nav.</h2>
        <p>pasaulē ir sūdi, bet autors par to nav saņēmies čīkstēt. pats vainīgs.</p>
      </div>
    );
  }

  const comments = await getComments(post.id);

  return (
    <div>
      <PostView post={post} />
      <div style={{ marginBottom: "1rem" }}>
        <Link href={`/post/${post.slug}`} style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          permalink
        </Link>
      </div>
      <CommentSection postId={post.id} comments={comments} />
    </div>
  );
}
