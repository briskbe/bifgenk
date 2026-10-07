import "server-only"
import path from "node:path"
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer"
import type { Style } from "@react-pdf/types"
import {
  formatMeetingDate,
  inlineText,
  type Block,
  type InlineContent,
  type StyledText,
  type TableCell,
  type TableContent,
} from "@/lib/meetings"

// ── Brand ──────────────────────────────────────────────────────────────────

const BRAND = {
  green: "#109B4A",
  greenDark: "#0d7e3c",
  greenTint: "#EEF8F2",
  ink: "#1a1a2e",
  text: "#33354a",
  muted: "#7a7d8c",
  border: "#e4e6eb",
  codeBg: "#f4f5f7",
}

// Matches BlockNote's default palette so colours look the same as in the editor.
const COLORS: Record<string, { text: string; background: string }> = {
  gray: { text: "#9b9a97", background: "#ebeced" },
  brown: { text: "#64473a", background: "#e9e5e3" },
  red: { text: "#e03e3e", background: "#fbe4e4" },
  orange: { text: "#d9730d", background: "#f6e9d9" },
  yellow: { text: "#dfab01", background: "#fbf3db" },
  green: { text: "#4d6461", background: "#ddedea" },
  blue: { text: "#0b6e99", background: "#ddebf1" },
  purple: { text: "#6940a5", background: "#eae4f2" },
  pink: { text: "#ad1a72", background: "#f4dfeb" },
}

const FONT_DIR = path.join(process.cwd(), "lib/pdf/fonts")
const LOGO_PATH = path.join(process.cwd(), "public/logo.png")

// Register once per process: re-registering (e.g. on hot reload) duplicates
// font sources and corrupts text layout.
const globalForFonts = globalThis as unknown as {
  meetingPdfFontsRegistered?: boolean
}
if (!globalForFonts.meetingPdfFontsRegistered) {
  globalForFonts.meetingPdfFontsRegistered = true
  Font.register({
    family: "Inter",
    fonts: [
      { src: path.join(FONT_DIR, "Inter-Regular.ttf"), fontWeight: 400 },
      {
        src: path.join(FONT_DIR, "Inter-Italic.ttf"),
        fontWeight: 400,
        fontStyle: "italic",
      },
      { src: path.join(FONT_DIR, "Inter-SemiBold.ttf"), fontWeight: 600 },
      {
        src: path.join(FONT_DIR, "Inter-SemiBoldItalic.ttf"),
        fontWeight: 600,
        fontStyle: "italic",
      },
      { src: path.join(FONT_DIR, "Inter-Bold.ttf"), fontWeight: 700 },
      {
        src: path.join(FONT_DIR, "Inter-BoldItalic.ttf"),
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  })
  Font.register({
    family: "JetBrains Mono",
    fonts: [
      {
        src: path.join(FONT_DIR, "JetBrainsMono-Regular.ttf"),
        fontWeight: 400,
      },
      { src: path.join(FONT_DIR, "JetBrainsMono-Bold.ttf"), fontWeight: 700 },
    ],
  })
  // Inter has no emoji, so react-pdf draws them as images from Twemoji.
  Font.registerEmojiSource({
    format: "png",
    url: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/",
  })
  // Never hyphenate words; Turkish words broken with English rules look wrong.
  Font.registerHyphenationCallback((word) => [word])
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10.5,
    color: BRAND.text,
    paddingTop: 54,
    paddingBottom: 64,
    paddingHorizontal: 54,
  },
  // Body line height is set on each text element rather than inherited:
  // inherited from the page, react-pdf drops fixed elements with render-prop
  // text (the page numbers); inherited from a View, it resolves against the
  // default 18pt font size. The font size is repeated here for the same reason.
  body: { fontSize: 10.5, lineHeight: 1.55 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: BRAND.green,
  },
  runningHeader: {
    position: "absolute",
    top: 22,
    left: 54,
    right: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: BRAND.muted,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 54,
    right: 54,
    paddingTop: 8,
    borderTopWidth: 0.75,
    borderTopColor: BRAND.border,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: BRAND.muted,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  logo: { width: 150, height: 24.5 },
  badge: {
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 1.2,
    color: BRAND.green,
    borderWidth: 1,
    borderColor: BRAND.green,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: BRAND.ink,
    lineHeight: 1.25,
    marginBottom: 16,
  },
  metaBox: {
    flexDirection: "row",
    backgroundColor: BRAND.greenTint,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: BRAND.green,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 26,
  },
  metaItem: { flex: 1, paddingRight: 10 },
  metaLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 1,
    color: BRAND.greenDark,
    marginBottom: 3,
  },
  metaValue: { fontSize: 10, fontWeight: 600, color: BRAND.ink },
  block: { marginBottom: 6 },
  h1: {
    fontSize: 17,
    fontWeight: 700,
    color: BRAND.ink,
    marginTop: 14,
    marginBottom: 6,
    lineHeight: 1.3,
  },
  h2: {
    fontSize: 13.5,
    fontWeight: 700,
    color: BRAND.ink,
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 0.75,
    borderBottomColor: BRAND.border,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: 11.5,
    fontWeight: 700,
    color: BRAND.ink,
    marginTop: 10,
    marginBottom: 4,
    lineHeight: 1.3,
  },
  listItem: { marginBottom: 4 },
  listRow: { flexDirection: "row" },
  listMarker: { width: 18, color: BRAND.green, fontWeight: 600 },
  listBody: { flex: 1 },
  nested: { marginLeft: 18, marginTop: 4 },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: BRAND.green,
    paddingLeft: 12,
    paddingVertical: 2,
    marginBottom: 8,
    color: BRAND.muted,
    fontStyle: "italic",
  },
  code: {
    fontFamily: "JetBrains Mono",
    fontSize: 9,
    lineHeight: 1.5,
    backgroundColor: BRAND.codeBg,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    color: BRAND.ink,
  },
  inlineCode: {
    fontFamily: "JetBrains Mono",
    fontSize: 9,
    backgroundColor: BRAND.codeBg,
    color: "#c7254e",
  },
  link: { color: BRAND.green, textDecoration: "underline" },
  divider: {
    borderBottomWidth: 0.75,
    borderBottomColor: BRAND.border,
    marginVertical: 10,
  },
  table: {
    borderWidth: 0.75,
    borderColor: BRAND.border,
    borderRadius: 4,
    marginBottom: 10,
  },
  tableRow: { flexDirection: "row" },
  tableCell: {
    padding: 6,
    borderRightWidth: 0.75,
    borderRightColor: BRAND.border,
  },
  tableHeader: {
    backgroundColor: BRAND.greenTint,
    fontWeight: 700,
    color: BRAND.ink,
  },
  image: { marginVertical: 6, objectFit: "contain", maxHeight: 360 },
  caption: {
    fontSize: 8.5,
    color: BRAND.muted,
    textAlign: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: "#b4b8c2",
    marginTop: 3,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: BRAND.green, borderColor: BRAND.green },
  empty: { color: BRAND.muted, fontStyle: "italic" },
})

// ── Inline content ─────────────────────────────────────────────────────────

function textStyle(styles: StyledText["styles"] = {}): Style {
  const style: Style = {}
  if (styles.bold) style.fontWeight = 700
  if (styles.italic) style.fontStyle = "italic"
  const decorations = [
    styles.underline && "underline",
    styles.strike && "line-through",
  ].filter(Boolean)
  if (decorations.length)
    style.textDecoration = decorations.join(" ") as Style["textDecoration"]
  if (styles.textColor && COLORS[styles.textColor])
    style.color = COLORS[styles.textColor].text
  if (styles.backgroundColor && COLORS[styles.backgroundColor]) {
    style.backgroundColor = COLORS[styles.backgroundColor].background
  }
  return styles.code ? { ...s.inlineCode, ...style } : style
}

function Inline({ content }: { content: Block["content"] }) {
  if (!content) return null
  if (typeof content === "string") return <>{content}</>
  if (!Array.isArray(content)) return null

  return (
    <>
      {content.map((item: InlineContent, i) => {
        if (typeof item === "string") return <Text key={i}>{item}</Text>
        if (item.type === "link") {
          const runs =
            typeof item.content === "string"
              ? [{ type: "text", text: item.content } as StyledText]
              : item.content
          return (
            <Link key={i} src={item.href} style={s.link}>
              {runs.map((run, j) => (
                <Text key={j} style={textStyle(run.styles)}>
                  {run.text}
                </Text>
              ))}
            </Link>
          )
        }
        return (
          <Text key={i} style={textStyle(item.styles)}>
            {item.text}
          </Text>
        )
      })}
    </>
  )
}

// ── Blocks ─────────────────────────────────────────────────────────────────

function blockStyle(props: Block["props"] = {}): Style {
  const style: Style = {}
  const textColor = props.textColor as string | undefined
  const backgroundColor = props.backgroundColor as string | undefined
  const alignment = props.textAlignment as string | undefined
  if (textColor && COLORS[textColor]) style.color = COLORS[textColor].text
  if (backgroundColor && COLORS[backgroundColor]) {
    style.backgroundColor = COLORS[backgroundColor].background
    style.paddingHorizontal = 4
    style.borderRadius = 3
  }
  if (alignment && alignment !== "left")
    style.textAlign = alignment as Style["textAlign"]
  return style
}

const BULLETS = ["•", "◦", "▪"]

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={checked ? [s.checkbox, s.checkboxChecked] : s.checkbox}>
      {checked && (
        <Svg width={7} height={7} viewBox="0 0 24 24">
          <Path
            d="M4 12.5l5 5L20 6.5"
            stroke="#ffffff"
            strokeWidth={3.5}
            fill="none"
          />
        </Svg>
      )}
    </View>
  )
}

function ListItem({
  marker,
  block,
  depth,
}: {
  marker: React.ReactNode
  block: Block
  depth: number
}) {
  return (
    <View style={s.listItem} wrap={false}>
      <View style={s.listRow}>
        {marker}
        <View style={s.listBody}>
          <Text style={[s.body, blockStyle(block.props)]}>
            <Inline content={block.content} />
          </Text>
        </View>
      </View>
      {block.children?.length ? (
        <View style={s.nested}>
          <Blocks blocks={block.children} depth={depth + 1} />
        </View>
      ) : null}
    </View>
  )
}

function Table({ content }: { content: TableContent }) {
  const headerRows = content.headerRows ?? 0
  const headerCols = content.headerCols ?? 0
  const widths = content.columnWidths ?? []
  const columnCount = Math.max(
    ...content.rows.map((row) => row.cells.length),
    1
  )
  const flexFor = (col: number) => {
    const known = widths.filter((w): w is number => typeof w === "number")
    const fallback = known.length
      ? known.reduce((a, b) => a + b, 0) / known.length
      : 1
    return widths[col] ?? fallback
  }

  return (
    <View style={s.table}>
      {content.rows.map((row, r) => (
        <View
          key={r}
          style={[
            s.tableRow,
            r < content.rows.length - 1
              ? { borderBottomWidth: 0.75, borderBottomColor: BRAND.border }
              : {},
          ]}
          wrap={false}
        >
          {Array.from({ length: columnCount }, (_, c) => {
            const cell = row.cells[c] as InlineContent[] | TableCell | undefined
            const cellContent = cell
              ? Array.isArray(cell)
                ? cell
                : cell.content
              : []
            const props = cell && !Array.isArray(cell) ? (cell.props ?? {}) : {}
            const isHeader = r < headerRows || c < headerCols
            return (
              <View
                key={c}
                style={[
                  s.tableCell,
                  { flex: flexFor(c) * (props.colspan ?? 1) },
                  c === columnCount - 1 ? { borderRightWidth: 0 } : {},
                  isHeader ? s.tableHeader : {},
                  blockStyle(props),
                ]}
              >
                <Text style={s.body}>
                  <Inline content={cellContent} />
                </Text>
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}

/** List numbers for each block: consecutive numbered items count up from `start`. */
function listNumbers(blocks: Block[]) {
  const numbers: number[] = []
  blocks.forEach((block, i) => {
    if (block.type !== "numberedListItem") return
    const start = block.props?.start
    const continues = i > 0 && blocks[i - 1].type === "numberedListItem"
    numbers[i] = continues
      ? numbers[i - 1] + 1
      : typeof start === "number"
        ? start
        : 1
  })
  return numbers
}

function Blocks({ blocks, depth = 0 }: { blocks: Block[]; depth?: number }) {
  const numbers = listNumbers(blocks)

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id ?? index
        const props = block.props ?? {}

        switch (block.type) {
          case "heading": {
            const level = Number(props.level ?? 1)
            const style = level === 1 ? s.h1 : level === 2 ? s.h2 : s.h3
            return (
              <View key={key} wrap={false} minPresenceAhead={40}>
                <Text style={[style, blockStyle(props)]}>
                  <Inline content={block.content} />
                </Text>
                {block.children?.length ? (
                  <Blocks blocks={block.children} depth={depth} />
                ) : null}
              </View>
            )
          }
          case "bulletListItem":
            return (
              <ListItem
                key={key}
                block={block}
                depth={depth}
                marker={
                  <Text style={s.listMarker}>
                    {BULLETS[depth % BULLETS.length]}
                  </Text>
                }
              />
            )
          case "numberedListItem": {
            return (
              <ListItem
                key={key}
                block={block}
                depth={depth}
                marker={<Text style={s.listMarker}>{numbers[index]}.</Text>}
              />
            )
          }
          case "checkListItem": {
            const checked = Boolean(props.checked)
            return (
              <View key={key} style={s.listItem} wrap={false}>
                <View style={s.listRow}>
                  <Checkbox checked={checked} />
                  <View style={s.listBody}>
                    <Text
                      style={[
                        s.body,
                        blockStyle(props),
                        checked
                          ? {
                              color: BRAND.muted,
                              textDecoration: "line-through",
                            }
                          : {},
                      ]}
                    >
                      <Inline content={block.content} />
                    </Text>
                  </View>
                </View>
                {block.children?.length ? (
                  <View style={s.nested}>
                    <Blocks blocks={block.children} depth={depth + 1} />
                  </View>
                ) : null}
              </View>
            )
          }
          case "toggleListItem":
            return (
              <ListItem
                key={key}
                block={block}
                depth={depth}
                marker={
                  <View style={{ width: 18, paddingTop: 4 }}>
                    <Svg width={7} height={7} viewBox="0 0 10 10">
                      <Path d="M2 1 L8 5 L2 9 Z" fill={BRAND.green} />
                    </Svg>
                  </View>
                }
              />
            )
          case "quote":
            return (
              <View key={key} style={s.quote} wrap={false}>
                <Text style={[s.body, blockStyle(props)]}>
                  <Inline content={block.content} />
                </Text>
              </View>
            )
          case "codeBlock":
            return (
              <View key={key} style={s.code}>
                {/* Non-breaking spaces keep leading indentation, which PDF text drops. */}
                <Text>
                  {inlineText(block.content).replace(/^ +/gm, (m) =>
                    "\u00a0".repeat(m.length)
                  )}
                </Text>
              </View>
            )
          case "divider":
            return <View key={key} style={s.divider} />
          case "pageBreak":
            return <View key={key} break />
          case "table":
            return block.content &&
              !Array.isArray(block.content) &&
              typeof block.content !== "string" ? (
              <Table key={key} content={block.content} />
            ) : null
          case "image": {
            const url = typeof props.url === "string" ? props.url : ""
            if (!/^https?:\/\//.test(url)) return null
            const caption =
              typeof props.caption === "string" ? props.caption : ""
            return (
              <View key={key} wrap={false}>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
                <Image src={url} style={s.image} />
                {caption ? <Text style={s.caption}>{caption}</Text> : null}
              </View>
            )
          }
          default: {
            // Paragraphs and any block type we don't style specially.
            const text = inlineText(block.content)
            return (
              <View key={key} style={s.block}>
                {text ? (
                  <Text style={[s.body, blockStyle(props)]}>
                    <Inline content={block.content} />
                  </Text>
                ) : (
                  <Text> </Text>
                )}
                {block.children?.length ? (
                  <View style={s.nested}>
                    <Blocks blocks={block.children} depth={depth + 1} />
                  </View>
                ) : null}
              </View>
            )
          }
        }
      })}
    </>
  )
}

/** Drops trailing empty paragraphs the editor keeps at the end of a document. */
function trimTrailingEmpty(blocks: Block[]) {
  const result = [...blocks]
  while (result.length) {
    const last = result[result.length - 1]
    if (
      last.type === "paragraph" &&
      !inlineText(last.content).trim() &&
      !last.children?.length
    )
      result.pop()
    else break
  }
  return result
}

// ── Document ───────────────────────────────────────────────────────────────

export type MeetingPdfInput = {
  title: string
  date: string
  startTime: string | null
  location: string | null
  content: unknown
  updatedAt: Date
}

function MeetingDocument({ meeting }: { meeting: MeetingPdfInput }) {
  const blocks = trimTrailingEmpty(
    Array.isArray(meeting.content) ? (meeting.content as Block[]) : []
  )
  const longDate = formatMeetingDate(meeting.date)
  const shortDate = formatMeetingDate(meeting.date, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const generated = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Brussels",
  })

  return (
    <Document
      title={`${meeting.title} · ${shortDate}`}
      author="BIF Genk Gençlik"
      subject="Toplantı Notları"
      creator="BIF Genk Yönetim Paneli"
      producer="BIF Genk Yönetim Paneli"
      language="tr-TR"
    >
      <Page size="A4" style={s.page}>
        {/* Fixed elements go first so react-pdf repeats them on every page. */}
        <View style={s.topBar} fixed />
        <View style={s.footer} fixed>
          <Text>BIF Genk Gençlik · Toplantı Notları · {generated}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Sayfa ${pageNumber} / ${totalPages}`
            }
          />
        </View>
        <View
          style={s.runningHeader}
          fixed
          render={({ pageNumber }) =>
            pageNumber > 1 ? (
              <>
                <Text>{meeting.title}</Text>
                <Text>{shortDate}</Text>
              </>
            ) : null
          }
        />

        <View style={s.brandRow}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
          <Image src={LOGO_PATH} style={s.logo} />
          <Text style={s.badge}>TOPLANTI NOTLARI</Text>
        </View>

        <Text style={s.title}>{meeting.title}</Text>

        <View style={s.metaBox}>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>TARİH</Text>
            <Text style={s.metaValue}>{longDate}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>SAAT</Text>
            <Text style={s.metaValue}>{meeting.startTime ?? "—"}</Text>
          </View>
          <View style={[s.metaItem, { flex: 1.3 }]}>
            <Text style={s.metaLabel}>YER</Text>
            <Text style={s.metaValue}>{meeting.location ?? "—"}</Text>
          </View>
        </View>

        {blocks.length ? (
          <Blocks blocks={blocks} />
        ) : (
          <Text style={s.empty}>Bu toplantı için henüz not eklenmedi.</Text>
        )}
      </Page>
    </Document>
  )
}

export function renderMeetingPdf(meeting: MeetingPdfInput) {
  return renderToBuffer(<MeetingDocument meeting={meeting} />)
}
