import type { LiveObject } from "@liveblocks/client";

export type MeetingDetails = {
  title: string;
  date: string;
  startTime: string;
  location: string;
};

declare global {
  interface Liveblocks {
    Presence: Record<string, never>;
    Storage: { details: LiveObject<MeetingDetails> };
    UserMeta: {
      id: string;
      info: { name: string; email: string; color: string };
    };
  }
}
