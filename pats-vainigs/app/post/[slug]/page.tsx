import { getPostBySlug, getComments } from "@/app/lib/posts";
import PostView from "@/app/ui/post-view";
import CommentSection from "@/app/ui/comment-section";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const comments = getComments(post.id);

  return (
    <div>
      <PostView post={post} />
      <CommentSection postId={post.id} comments={comments} />
    </div>
  );
}
