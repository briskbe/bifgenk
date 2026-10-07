import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { meeting, user } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { MeetingWorkspace } from "./meeting-workspace";

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const [found] = await db
    .select({ meeting, updatedByName: user.name })
    .from(meeting)
    .leftJoin(user, eq(meeting.updatedById, user.id))
    .where(eq(meeting.id, id));

  if (!found) notFound();
  const m = found.meeting;

  return (
    <MeetingWorkspace
      key={m.id}
      meeting={{
        id: m.id,
        title: m.title,
        date: m.date,
        startTime: m.startTime ?? "",
        location: m.location ?? "",
        content: Array.isArray(m.content) ? m.content : [],
        updatedAt: m.updatedAt.toISOString(),
        updatedByName: found.updatedByName,
      }}
    />
  );
}
