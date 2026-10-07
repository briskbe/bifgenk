import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meeting } from "@/lib/db/schema";
import { authorizeMeetingUser, meetingIdFromRoom } from "@/lib/liveblocks";
import { getSession } from "@/lib/session";

// Liveblocks calls this before joining a room. Only admins may join, and only
// rooms that belong to an existing meeting.
export async function POST(request: Request) {
  const session = await getSession();
  if (session?.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { room } = (await request.json().catch(() => ({}))) as { room?: string };
  const meetingId = room ? meetingIdFromRoom(room) : null;
  if (!room || !meetingId) return new NextResponse("Unknown room", { status: 403 });

  const [found] = await db.select({ id: meeting.id }).from(meeting).where(eq(meeting.id, meetingId));
  if (!found) return new NextResponse("Unknown room", { status: 403 });

  const { status, body } = await authorizeMeetingUser(session.user, room);
  return new NextResponse(body, { status });
}
