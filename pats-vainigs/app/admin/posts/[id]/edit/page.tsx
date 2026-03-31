import { getSession } from "@/app/lib/auth";
import { getPostById } from "@/app/lib/posts";
import { redirect, notFound } from "next/navigation";
import { FormWithMessage } from "@/app/ui/form-message";
import { updatePost } from "@/app/actions/posts";
import PostEditor from "@/app/ui/post-editor";
import Link from "next/link";

export const metadata = {
  title: "edit post | pats vainīgs",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/");

  const { id } = await params;
  const post = getPostById(Number(id));
  if (!post) notFound();

  return (
    <div>
      <h1 className="page-title">edit post</h1>

      <nav className="admin-nav">
        <Link href="/admin">posts</Link>
        <Link href="/admin/posts/new">new post</Link>
        <Link href="/admin/users">users</Link>
        <Link href="/admin/terms">terms</Link>
      </nav>

      <FormWithMessage action={updatePost} className="form-stack post-form">
        <input type="hidden" name="id" value={post.id} />
        <div className="form-field">
          <label htmlFor="title">title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post.title}
          />
        </div>
        <PostEditor defaultValue={post.content} />
        <button type="submit" className="form-submit">
          update
        </button>
      </FormWithMessage>
    </div>
  );
}
