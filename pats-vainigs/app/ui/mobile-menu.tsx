"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="mobile-header">
        <Link href="/" className="logo">
          pats vainīgs
        </Link>
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          <span className={`hamburger-line ${open ? "open" : ""}`} />
          <span className={`hamburger-line ${open ? "open" : ""}`} />
          <span className={`hamburger-line ${open ? "open" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="mobile-drawer" onClick={() => setOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
