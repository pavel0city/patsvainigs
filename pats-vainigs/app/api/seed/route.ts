import { db } from "@/app/lib/db";
import { hashSync } from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const existing = db
    .prepare("SELECT id FROM users WHERE username = 'admin'")
    .get();

  if (existing) {
    return NextResponse.json({ message: "Admin already exists. Pats vainīgs." });
  }

  const hash = hashSync("admin", 10);
  db.prepare(
    "INSERT INTO users (username, nickname, tag, password_hash, role) VALUES (?, ?, ?, ?, ?)"
  ).run("admin", "the author", "frustrated", hash, "admin");

  return NextResponse.json({
    message: "Admin created. username: admin, password: admin. Change it. Obviously.",
  });
}
