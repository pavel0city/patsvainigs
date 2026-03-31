import Link from "next/link";
import { getSession } from "@/app/lib/auth";
import { logout } from "@/app/actions/auth";

export default async function Sidebar() {
  const session = await getSession();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link href="/" className="logo">
          pats vainīgs
        </Link>
        <p className="tagline">vidējā vecuma un īsa dzimumlocekļa krīzes blogs par lietām, pie kurām ir vainīga valdiiba</p>

        <nav className="nav">
          <Link href="/">sasāpējies</Link>
          <Link href="/archive">kādreiz sasāpējās</Link>
          <Link href="/terms">terminoloģija</Link>
          <Link href="/disclaimer">diskleimeris</Link>
          {session?.role === "admin" && <Link href="/admin">admin</Link>}
        </nav>
      </div>

      <div className="sidebar-bottom">
        {session ? (
          <div className="user-info">
            <span className="user-name">
              {session.nickname}
              {session.tag && <span className="user-tag"> #{session.tag}</span>}
            </span>
            <form action={logout}>
              <button type="submit" className="link-btn">
                leave
              </button>
            </form>
          </div>
        ) : (
          <div className="auth-links">
            <Link href="/login">ielogoties krīzē</Link>
            <Link href="/register">pievienoties krīzei</Link>
          </div>
        )}
        <div className="disclaimer">
          <strong className="disclaimer-heading">Drošības policijai</strong>
          <p>viss rakstītais ir autora subjektīvs viedoklis un pašironija. ja esi aizvainots — pats vainīgs. <a href="https://likumi.lv/ta/id/57980-latvijas-republikas-satversme" target="_blank" rel="noopener noreferrer" className="disclaimer-link">Satversmes 100. pants</a></p>
          <Link href="/disclaimer" className="disclaimer-link">prūfi</Link>
        </div>
      </div>
    </aside>
  );
}
