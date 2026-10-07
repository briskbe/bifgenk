"use client";

import { memo, useCallback } from "react";
import "@blocknote/shadcn/style.css";
import {
  BlockNoteSchema,
  createHeadingBlockSpec,
  createPageBreakBlockSpec,
  defaultBlockSpecs,
  filterSuggestionItems,
  type PartialBlock,
} from "@blocknote/core";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  getPageBreakReactSlashMenuItems,
  useCreateBlockNote,
  type DefaultReactSuggestionItem,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { tr } from "./dictionary-tr";

// No file storage is set up, so upload-based media blocks are left out.
// Images can still be embedded from a URL.
const baseBlocks = Object.fromEntries(
  Object.entries(defaultBlockSpecs).filter(([type]) => !["audio", "video", "file", "heading"].includes(type))
) as Omit<typeof defaultBlockSpecs, "audio" | "video" | "file" | "heading">;

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...baseBlocks,
    heading: createHeadingBlockSpec({ levels: [1, 2, 3] }),
    pageBreak: createPageBreakBlockSpec(),
  },
});

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
  initialContent: unknown[];
  onChange: (content: unknown[]) => void;
};

// Memoized: the parent re-renders while saving, and re-rendering BlockNote
// mid-typing (e.g. while the slash menu closes) can trigger update loops.
const MeetingEditor = memo(function MeetingEditor({ initialContent, onChange }: MeetingEditorProps) {
  const editor = useCreateBlockNote({
    schema,
    dictionary: tr,
    initialContent: initialContent.length
      ? (initialContent as PartialBlock<typeof schema.blockSchema>[])
      : undefined,
    tables: { splitCells: true, cellBackgroundColor: true, cellTextColor: true, headers: true },
  });

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

  const handleChange = useCallback(() => onChange(editor.document), [editor, onChange]);

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      slashMenu={false}
      onChange={handleChange}
      className="meeting-editor"
    >
      <SuggestionMenuController triggerCharacter="/" getItems={getSlashMenuItems} />
    </BlockNoteView>
  );
});

export default MeetingEditor;
