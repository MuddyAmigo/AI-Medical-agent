import { NextResponse, NextRequest } from "next/server";
import db from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email =
    user.primaryEmailAddress?.emailAddress ||
    (user.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
    null;

  if (!email) {
    return NextResponse.json({ error: "No email available on user" }, { status: 400 });
  }

  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existing && existing.length > 0) {
      return NextResponse.json({ user: existing[0] }, { status: 200 });
    }

    const inserted = await db
      .insert(usersTable)
      .values({
        name: user.firstName || "No Name",
        email,
        credits: 10,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        credits: usersTable.credits,
      });

    // return consistent shape and status for created resource
    return NextResponse.json({ user: inserted[0] }, { status: 201 });
  } catch (err: any) {
    console.error("Users API error:", err);

    // Postgres unique violation
    if (err?.code === "23505") {
      const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
      return NextResponse.json({ user: existing?.[0] || null }, { status: 200 });
    }

    return NextResponse.json({ error: "Failed to create or fetch user" }, { status: 500 });
  }
}
