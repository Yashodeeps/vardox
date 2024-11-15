import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "../[...nextauth]/authConfig";
import { dbconnect } from "@/lib/prisma";

export async function GET() {
  const prisma = await dbconnect();
  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = session.user
      ? await prisma.user.findUnique({
          where: { email: session.user.email ?? undefined },
          select: {
            id: true,
            identifier: true,
            accountType: true,
            walletAddress: true,
          },
        })
      : null;

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error checking user status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
