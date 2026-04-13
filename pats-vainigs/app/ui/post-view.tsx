import type { Post } from "@/app/lib/posts";
import { getTermsMap } from "@/app/lib/terms";
import RichContent from "./rich-content";

export default async function PostView({ post }: { post: Post }) {
  const date = new Date(post.created_at + "Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const termsMap = await getTermsMap();
  const termsObj: Record<string, string> = {};
  for (const [k, v] of termsMap) {
    termsObj[k] = v;
  }

  return (
    <article className="post">
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>{date}</span>
          <span className="separator">/</span>
          <span>{post.author_nickname}</span>
        </div>
      </header>
      <RichContent content={post.content} terms={termsObj} />
    </article>
  );
}
