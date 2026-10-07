// Helpers shared by the meeting pages, server actions and the PDF export.
// Meeting content is a BlockNote document stored as JSON; the types below
// describe only the parts we read outside the editor.

export type StyledText = {
  type: "text";
  text: string;
  styles?: Partial<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
    code: boolean;
    textColor: string;
    backgroundColor: string;
  }>;
};

export type LinkContent = { type: "link"; href: string; content: StyledText[] | string };

export type InlineContent = StyledText | LinkContent | string;

export type TableCell = {
  type: "tableCell";
  props?: Partial<{ backgroundColor: string; textColor: string; textAlignment: string; colspan: number; rowspan: number }>;
  content: InlineContent[];
};

export type TableContent = {
  type: "tableContent";
  columnWidths?: (number | null | undefined)[];
  headerRows?: number;
  headerCols?: number;
  rows: { cells: (InlineContent[] | TableCell)[] }[];
};

export type Block = {
  id?: string;
  type: string;
  props?: Record<string, unknown>;
  content?: InlineContent[] | TableContent | string;
  children?: Block[];
};

export const MEETING_TIME_ZONE = "Europe/Brussels";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidDate(value: string) {
  return DATE_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function isValidTime(value: string) {
  return TIME_RE.test(value);
}

/** Today's date (YYYY-MM-DD) in Belgium, where the meetings take place. */
export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: MEETING_TIME_ZONE }).format(new Date());
}

function parseDate(date: string) {
  // Dates are plain calendar days: format them in UTC so they never shift.
  return new Date(`${date}T00:00:00Z`);
}

export function formatMeetingDate(
  date: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric", weekday: "long" }
) {
  return parseDate(date).toLocaleDateString("tr-TR", { ...options, timeZone: "UTC" });
}

export function meetingDateParts(date: string) {
  const d = parseDate(date);
  return {
    day: d.toLocaleDateString("tr-TR", { day: "2-digit", timeZone: "UTC" }),
    month: d.toLocaleDateString("tr-TR", { month: "short", timeZone: "UTC" }).replace(".", ""),
    year: d.toLocaleDateString("tr-TR", { year: "numeric", timeZone: "UTC" }),
    weekday: d.toLocaleDateString("tr-TR", { weekday: "long", timeZone: "UTC" }),
  };
}

export function inlineText(content: Block["content"]): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) {
    return content.rows
      .flatMap((row) => row.cells.map((cell) => inlineText(Array.isArray(cell) ? cell : cell.content)))
      .join(" ");
  }
  return content
    .map((item) => {
      if (typeof item === "string") return item;
      if (item.type === "link") return typeof item.content === "string" ? item.content : inlineText(item.content);
      return item.text;
    })
    .join("");
}

/** Plain-text preview of a meeting's notes, skipping empty blocks. */
export function meetingExcerpt(blocks: unknown, maxLength = 160) {
  const parts: string[] = [];
  const walk = (list: Block[]) => {
    for (const block of list) {
      const text = inlineText(block.content).trim();
      if (text) parts.push(text);
      if (block.children?.length) walk(block.children);
    }
  };
  if (Array.isArray(blocks)) walk(blocks as Block[]);
  const text = parts.join(" · ");
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}

/** Starting structure for a new meeting's notes. */
export function meetingTemplate(): Block[] {
  const heading = (text: string): Block => ({
    type: "heading",
    props: { level: 2 },
    content: [{ type: "text", text, styles: {} }],
  });
  return [
    heading("Katılımcılar"),
    { type: "bulletListItem", content: [] },
    heading("Gündem"),
    { type: "numberedListItem", content: [] },
    heading("Notlar"),
    { type: "paragraph", content: [] },
    heading("Alınan kararlar"),
    { type: "bulletListItem", content: [] },
    heading("Yapılacaklar"),
    { type: "checkListItem", content: [] },
  ];
}

const TR_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u" };

export function slugify(value: string) {
  return value
    .replace(/[çğıİöşü]/gi, (ch) => TR_MAP[ch] ?? TR_MAP[ch.toLowerCase()] ?? ch)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function meetingPdfFilename(meeting: { title: string; date: string }) {
  const slug = slugify(meeting.title);
  return `toplanti-${meeting.date}${slug ? `-${slug}` : ""}.pdf`;
}
