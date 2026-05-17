import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
  // Boilerplate placeholder for Web Push / Firebase Cloud Messaging (FCM).
  // Would accept a subscription object or FCM token and store it in the
  // database to send streak reminders and new community challenges.
  return NextResponse.json({ success: true, message: "Push registration placeholder" });
}
