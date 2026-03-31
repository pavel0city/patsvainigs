import { getSession } from "@/app/lib/auth";
import { getAllUsers, updateUser, deleteUser } from "@/app/actions/users";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "users | pats vainīgs",
};

export default async function UsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/");

  const users = await getAllUsers();

  return (
    <div>
      <h1 className="page-title">users</h1>

      <nav className="admin-nav">
        <Link href="/admin">posts</Link>
        <Link href="/admin/posts/new">new post</Link>
        <Link href="/admin/users">users</Link>
        <Link href="/admin/terms">terms</Link>
      </nav>

      <table className="admin-table">
        <thead>
          <tr>
            <th>username</th>
            <th>nickname</th>
            <th>tag</th>
            <th>role</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>
                <form action={updateUser as unknown as (formData: FormData) => void} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input type="hidden" name="id" value={user.id} />
                  <input
                    name="nickname"
                    defaultValue={user.nickname}
                    style={{
                      fontFamily: "inherit",
                      fontSize: "0.85rem",
                      padding: "0.2rem 0.4rem",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      width: "100px",
                    }}
                  />
                  <input
                    name="tag"
                    defaultValue={user.tag}
                    placeholder="tag"
                    style={{
                      fontFamily: "inherit",
                      fontSize: "0.85rem",
                      padding: "0.2rem 0.4rem",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      width: "80px",
                    }}
                  />
                  <select
                    name="role"
                    defaultValue={user.role}
                    style={{
                      fontFamily: "inherit",
                      fontSize: "0.85rem",
                      padding: "0.2rem 0.4rem",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                    }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button type="submit" className="action-btn">
                    save
                  </button>
                </form>
              </td>
              <td>{user.tag}</td>
              <td style={{ color: "var(--muted)" }}>{user.role}</td>
              <td>
                {user.id !== session.id && (
                  <form action={deleteUser as unknown as (formData: FormData) => void}>
                    <input type="hidden" name="id" value={user.id} />
                    <button type="submit" className="action-btn btn-danger">
                      delete
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
