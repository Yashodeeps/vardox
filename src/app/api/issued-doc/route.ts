import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/lib/prisma";
import { authConfig } from "../auth/[...nextauth]/authConfig";

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authConfig);

  const { name, type, transactionHash, authority, issuerAddress, ownerId } =
    await req.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newIssuance = await prisma.document.create({
      data: {
        name,
        type,
        transactionHash,
        authority,
        issuerAddress,
        ownerId: ownerId,
      },
    });

    if (!newIssuance) {
      return NextResponse.json(
        { error: "Error storing Issuance" },
        { status: 400 }
      );
    }
    console.log("Document created:", newIssuance);

    return NextResponse.json({ newIssuance }, { status: 200 });
  } catch (error) {
    console.error("Error Storing Issuance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const session = await getServerSession(authConfig);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("owner");
  console.log("Owner ID:", ownerId);

  if (!ownerId) {
    return NextResponse.json(
      { error: "Missing 'owner' query parameter" },
      { status: 400 }
    );
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        ownerId: ownerId,
      },
    });

    if (!documents) {
      return NextResponse.json(
        { error: "No documents found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
