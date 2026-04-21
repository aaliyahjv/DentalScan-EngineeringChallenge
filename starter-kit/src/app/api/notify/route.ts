import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * CHALLENGE: NOTIFICATION SYSTEM
 * 
 * Your goal is to implement a robust notification logic.
 * 1. When a scan is "completed", create a record in the Notification table.
 * 2. Return a success status to the client.
 * 3. Bonus: Handle potential errors (e.g., database connection issues).
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scanId, status } = body;

    if (!scanId || typeof scanId !== "string") {
      return NextResponse.json(
        { error: "Invalid scanId" },
        { status: 400 }
      );
    }

    if (status === "completed") {
      let notificationSuccess = false;

      try {
        await prisma.notification.create({
          data: {
            userId: "demo-patient",
            title: "Scan Completed",
            message: `Scan ${scanId} has been successfully uploaded.`,
            read: false,
          },
        });
        notificationSuccess = true;
      } catch (err) {
        console.error("Notification creation failed:", err);
      }

      return NextResponse.json({
        ok: true,
        notificationTriggered: notificationSuccess,
      });
    }

    return NextResponse.json({
      ok: true,
      skipped: true,
      message: "No notification triggered",
    });
  } catch (err) {
    console.error("FULL ERROR:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}