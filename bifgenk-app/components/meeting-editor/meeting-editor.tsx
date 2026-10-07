"use client";

import { memo, useCallback } from "react";
import "@blocknote/shadcn/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import { filterSuggestionItems, type BlockNoteEditor } from "@blocknote/core";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  getPageBreakReactSlashMenuItems,
  useCreateBlockNote,
  type DefaultReactSuggestionItem,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import {
  useIsEditorReady,
  useLiveblocksExtension,
  withLiveblocksEditorOptions,
} from "@liveblocks/react-blocknote";
import { tr } from "./dictionary-tr";
import { meetingSchema } from "./schema";

/**
 * The slash menu renders one heading per run of items with the same group, so
 * extra items (page break) must sit next to the rest of their group.
 */
function groupContiguously(items: DefaultReactSuggestionItem[]) {
  const groupOrder = new Map<string | undefined, number>();
  for (const item of items) if (!groupOrder.has(item.group)) groupOrder.set(item.group, groupOrder.size);
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => groupOrder.get(a.item.group)! - groupOrder.get(b.item.group)! || a.index - b.index)
    .map(({ item }) => item);
}

type MeetingEditorProps = {
  /** Called with the full document on every change. `local` is false for edits from other people. */
  onChange: (content: unknown[], local: boolean) => void;
};

// Must be rendered inside a Liveblocks RoomProvider: the document lives in the
// room and is synced live between everyone who has the meeting open.
// Memoized: re-rendering BlockNote mid-typing (e.g. while the slash menu
// closes) can trigger update loops.
const MeetingEditor = memo(function MeetingEditor({ onChange }: MeetingEditorProps) {
  const liveblocks = useLiveblocksExtension({ comments: false, mentions: false });
  const editor = useCreateBlockNote(
    withLiveblocksEditorOptions(
      liveblocks,
      {
        schema: meetingSchema,
        dictionary: tr,
        tables: { splitCells: true, cellBackgroundColor: true, cellTextColor: true, headers: true },
      },
      { mentions: false }
    )
  );
  const ready = useIsEditorReady();

  const getSlashMenuItems = useCallback(
    async (query: string) =>
      filterSuggestionItems(
        groupContiguously([
          ...getDefaultReactSlashMenuItems(editor),
          ...getPageBreakReactSlashMenuItems(editor),
        ]),
        query
      ),
    [editor]
  );

  const handleChange = useCallback(
    (changed: BlockNoteEditor<typeof meetingSchema.blockSchema>, context: { getChanges: () => { source: { type: string } }[] }) => {
      const local = context.getChanges().some((change) => change.source.type !== "yjs-remote");
      onChange(changed.document, local);
    },
    [onChange]
  );

  return (
    <div className="relative">
      {!ready && <EditorSkeleton />}
      <div className={ready ? undefined : "invisible"}>
        <BlockNoteView
          editor={editor}
          theme="light"
          slashMenu={false}
          onChange={handleChange as never}
          className="meeting-editor"
        >
          <SuggestionMenuController triggerCharacter="/" getItems={getSlashMenuItems} />
        </BlockNoteView>
      </div>
    </div>
  );
});

export function EditorSkeleton() {
  return (
    <div className="absolute inset-x-[54px] top-0 space-y-3 py-2" aria-hidden>
      <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default MeetingEditor;
