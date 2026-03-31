import "./ui/layout.css";
import Sidebar from "./ui/sidebar";

export const metadata = {
  title: "pats vainīgs",
  description: "a blog about things that are definitely someone else's fault",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
