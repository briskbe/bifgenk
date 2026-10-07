import {
  BlockNoteSchema,
  createHeadingBlockSpec,
  createPageBreakBlockSpec,
  defaultBlockSpecs,
} from "@blocknote/core";

// Shared by the browser editor and the server (which seeds live documents).
// No file storage is set up, so upload-based media blocks are left out.
// Images can still be embedded from a URL.
const baseBlocks = Object.fromEntries(
  Object.entries(defaultBlockSpecs).filter(([type]) => !["audio", "video", "file", "heading"].includes(type))
) as Omit<typeof defaultBlockSpecs, "audio" | "video" | "file" | "heading">;

export const meetingSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...baseBlocks,
    heading: createHeadingBlockSpec({ levels: [1, 2, 3] }),
    pageBreak: createPageBreakBlockSpec(),
  },
});

/** Yjs fragment the Liveblocks BlockNote extension edits (its default field). */
export const MEETING_DOC_FIELD = "default";
