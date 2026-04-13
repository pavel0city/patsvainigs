import { getSession } from "@/app/lib/auth";
import { getAllPosts } from "@/app/lib/posts";
import { deletePost } from "@/app/actions/posts";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "admin | pats vainīgs",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/");

  const posts = await getAllPosts();

  return (
    <div>
      <h1 className="page-title">admin</h1>

      <nav className="admin-nav">
        <Link href="/admin">posts</Link>
        <Link href="/admin/posts/new">new post</Link>
        <Link href="/admin/users">users</Link>
        <Link href="/admin/terms">terms</Link>
      </nav>

      <div className="admin-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>title</th>
              <th>date</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link href={`/post/${post.slug}`}>{post.title}</Link>
                </td>
                <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                  {new Date(post.created_at + "Z").toLocaleDateString()}
                </td>
                <td>
                  <div className="actions-cell">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="action-btn"
                      style={{ border: "none" }}
                    >
                      edit
                    </Link>
                    <form action={deletePost as unknown as (formData: FormData) => void}>
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit" className="action-btn btn-danger">
                        delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={3} style={{ color: "var(--muted)" }}>
                  no posts. the void stares back.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
