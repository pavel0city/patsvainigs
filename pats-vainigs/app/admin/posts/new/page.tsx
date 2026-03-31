import { getSession } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { FormWithMessage } from "@/app/ui/form-message";
import { createPost } from "@/app/actions/posts";
import PostEditor from "@/app/ui/post-editor";
import Link from "next/link";

export const metadata = {
  title: "new post | pats vainīgs",
};

export default async function NewPostPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/");

  return (
    <div>
      <h1 className="page-title">new post</h1>

      <nav className="admin-nav">
        <Link href="/admin">posts</Link>
        <Link href="/admin/posts/new">new post</Link>
        <Link href="/admin/users">users</Link>
        <Link href="/admin/terms">terms</Link>
      </nav>

      <FormWithMessage action={createPost} className="form-stack post-form">
        <div className="form-field">
          <label htmlFor="title">title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="what's wrong this time?"
          />
        </div>
        <PostEditor placeholder="let it all out..." />
        <button type="submit" className="form-submit">
          publish
        </button>
      </FormWithMessage>
    </div>
  );
}
