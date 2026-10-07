import "server-only";
import { Liveblocks, LiveblocksError } from "@liveblocks/node";
import { ServerBlockNoteEditor } from "@blocknote/server-util";
import * as Y from "yjs";
import { MEETING_DOC_FIELD, meetingSchema } from "@/components/meeting-editor/schema";

let client: Liveblocks | null = null;

function liveblocks() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
  client ??= new Liveblocks({ secret });
  return client;
}

// Keeps local development and preview deployments out of production rooms.
const ROOM_PREFIX = `bifgenk-${process.env.VERCEL_ENV ?? "local"}:meeting:`;

export function meetingRoomId(meetingId: string) {
  return `${ROOM_PREFIX}${meetingId}`;
}

export function meetingIdFromRoom(roomId: string) {
  return roomId.startsWith(ROOM_PREFIX) ? roomId.slice(ROOM_PREFIX.length) : null;
}

const CURSOR_COLORS = ["#109B4A", "#0b6e99", "#d9730d", "#6940a5", "#e03e3e", "#ad1a72", "#0d9488", "#b45309"];

/** Stable cursor colour per user. */
export function userColor(userId: string) {
  let hash = 0;
  for (const ch of userId) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

export function authorizeMeetingUser(user: { id: string; name: string; email: string }, roomId: string) {
  const session = liveblocks().prepareSession(user.id, {
    userInfo: { name: user.name, email: user.email, color: userColor(user.id) },
  });
  session.allow(roomId, session.FULL_ACCESS);
  return session.authorize();
}

/**
 * Creates the meeting's live room on first open and loads the saved notes into
 * it. Creating the room is atomic, so only one request ever seeds it.
 */
export async function ensureMeetingRoom(meetingId: string, content: unknown[]) {
  const roomId = meetingRoomId(meetingId);
  try {
    await liveblocks().createRoom(roomId, { defaultAccesses: [] });
  } catch (error) {
    if (error instanceof LiveblocksError && error.status === 409) return roomId;
    throw error;
  }

  if (content.length) {
    const editor = ServerBlockNoteEditor.create({ schema: meetingSchema });
    const doc = editor.blocksToYDoc(content as Parameters<typeof editor.blocksToYDoc>[0], MEETING_DOC_FIELD);
    await liveblocks().sendYjsBinaryUpdate(roomId, Y.encodeStateAsUpdate(doc));
  }
  return roomId;
}

export async function deleteMeetingRoom(meetingId: string) {
  try {
    await liveblocks().deleteRoom(meetingRoomId(meetingId));
  } catch (error) {
    if (!(error instanceof LiveblocksError && error.status === 404)) console.error(error);
  }
}
