import { execute, queryOne } from "@/app/lib/db";
import { hashSync } from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const existing = await queryOne<{ id: number }>(
      "SELECT id FROM users WHERE username = 'admin'"
    );

    if (existing) {
      return NextResponse.json({ message: "Admin already exists. Pats vainīgs." });
    }

    const hash = hashSync("admin", 10);
    await execute(
      "INSERT INTO users (username, nickname, tag, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      ["admin", "the author", "frustrated", hash, "admin"]
    );

    return NextResponse.json({
      message: "Admin created. username: admin, password: admin. Change it. Obviously.",
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
