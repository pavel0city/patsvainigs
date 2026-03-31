import { getSession } from "@/app/lib/auth";
import { getAllTerms } from "@/app/lib/terms";
import { createTerm, updateTerm, deleteTerm } from "@/app/actions/terms";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FormWithMessage } from "@/app/ui/form-message";

export const metadata = {
  title: "terms | pats vainīgs",
};

export default async function TermsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/");

  const terms = getAllTerms();

  return (
    <div>
      <h1 className="page-title">termini</h1>

      <nav className="admin-nav">
        <Link href="/admin">posts</Link>
        <Link href="/admin/posts/new">new post</Link>
        <Link href="/admin/users">users</Link>
        <Link href="/admin/terms">terms</Link>
      </nav>

      <div className="admin-section">
        <h2 style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>add term</h2>
        <FormWithMessage action={createTerm} className="form-stack">
          <div className="form-field">
            <label htmlFor="name">term</label>
            <input id="name" name="name" type="text" required placeholder="e.g. zajebal" />
          </div>
          <div className="form-field">
            <label htmlFor="definition">definition</label>
            <textarea
              id="definition"
              name="definition"
              required
              rows={2}
              placeholder="what it means for the uninitiated"
            />
          </div>
          <button type="submit" className="form-submit">add</button>
        </FormWithMessage>
      </div>

      <div className="admin-section">
        <h2 style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
          existing terms ({terms.length})
        </h2>
        {terms.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            no terms defined. use <code>&lt;t&gt;term&lt;/t&gt;</code> in posts to reference them.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>term</th>
                <th>definition</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((term) => (
                <tr key={term.id}>
                  <td>
                    <form
                      action={updateTerm as unknown as (formData: FormData) => void}
                      style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
                    >
                      <input type="hidden" name="id" value={term.id} />
                      <input
                        name="name"
                        defaultValue={term.name}
                        style={{
                          fontFamily: "inherit",
                          fontSize: "0.85rem",
                          padding: "0.2rem 0.4rem",
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          width: "120px",
                        }}
                      />
                      <input
                        name="definition"
                        defaultValue={term.definition}
                        style={{
                          fontFamily: "inherit",
                          fontSize: "0.85rem",
                          padding: "0.2rem 0.4rem",
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          width: "240px",
                        }}
                      />
                      <button type="submit" className="action-btn">save</button>
                    </form>
                  </td>
                  <td></td>
                  <td>
                    <form action={deleteTerm as unknown as (formData: FormData) => void}>
                      <input type="hidden" name="id" value={term.id} />
                      <button type="submit" className="action-btn btn-danger">delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "2rem", fontSize: "0.8rem", color: "var(--muted)" }}>
        <p><strong>usage in posts:</strong></p>
        <p style={{ marginTop: "0.25rem" }}>
          <code>&lt;t&gt;zajebal&lt;/t&gt;</code> — clickable term with tooltip
        </p>
        <p>
          <code>_italic text_</code> — italic
        </p>
      </div>
    </div>
  );
}
