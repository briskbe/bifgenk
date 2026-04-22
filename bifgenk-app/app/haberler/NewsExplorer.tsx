"use client";

import { useMemo, useState } from "react";
import {
  articles as allArticles,
  CATEGORY_LABELS,
  type NewsArticle,
  type NewsCategory,
} from "./news-data";

type FilterKey = "all" | NewsCategory;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "duyuru", label: CATEGORY_LABELS.duyuru },
  { key: "etkinlik", label: CATEGORY_LABELS.etkinlik },
  { key: "topluluk", label: CATEGORY_LABELS.topluluk },
  { key: "mescid", label: CATEGORY_LABELS.mescid },
  { key: "spor", label: CATEGORY_LABELS.spor },
  { key: "baskan", label: CATEGORY_LABELS.baskan },
];

const PAGE_SIZE = 6;

export function NewsExplorer({ articles }: { articles: NewsArticle[] }) {
  const [active, setActive] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const catOk = active === "all" || a.category === active;
      const qOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [active, query, articles]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const counts = useMemo(() => {
    const map = new Map<FilterKey, number>();
    map.set("all", allArticles.length);
    for (const a of allArticles) {
      map.set(a.category, (map.get(a.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const onFilter = (key: FilterKey) => {
    setActive(key);
    setVisible(PAGE_SIZE);
  };

  return (
    <section className="news-explorer">
      <div className="news-explorer-container">
        <div className="news-toolbar">
          <div className="news-filter-pills" role="tablist" aria-label="Kategori filtresi">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={active === f.key}
                className={`news-pill${active === f.key ? " is-active" : ""}`}
                onClick={() => onFilter(f.key)}
              >
                {f.label}
                <span className="news-pill-count">{counts.get(f.key) ?? 0}</span>
              </button>
            ))}
          </div>

          <label className="news-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Haberlerde ara…"
              aria-label="Haberlerde ara"
            />
          </label>
        </div>

        {shown.length === 0 ? (
          <div className="news-empty">
            <div className="news-empty-icon" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3>Hiçbir haber bulunamadı</h3>
            <p>Farklı bir kategori seçmeyi ya da başka bir kelimeyle aramayı deneyebilirsin.</p>
          </div>
        ) : (
          <div className="news-grid">
            {shown.map((a, idx) => (
              <article
                key={a.slug}
                className="news-card"
                style={{ animationDelay: `${Math.min(idx * 60, 480)}ms` }}
              >
                <a href={`/haberler/${a.slug}`} className="news-card-media">
                  <img src={a.image} alt="" loading="lazy" />
                  <span className={`news-card-chip chip-${a.category}`}>
                    {CATEGORY_LABELS[a.category]}
                  </span>
                </a>
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <time dateTime={a.date}>{a.dateLabel}</time>
                    <span className="news-card-dot" aria-hidden />
                    <span>{a.readMinutes} dk okuma</span>
                  </div>
                  <h3 className="news-card-title">
                    <a
                      href={`/haberler/${a.slug}`}
                      dangerouslySetInnerHTML={{ __html: a.title }}
                    />
                  </h3>
                  <p
                    className="news-card-excerpt"
                    dangerouslySetInnerHTML={{ __html: a.excerpt }}
                  />
                  <div className="news-card-footer">
                    <span className="news-card-author">
                      <span className="news-card-avatar" aria-hidden>
                        {a.author.charAt(0)}
                      </span>
                      {a.author}
                    </span>
                    <a href={`/haberler/${a.slug}`} className="news-card-cta">
                      Devamını oku
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="news-loadmore-wrap">
            <button
              className="news-loadmore"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Daha fazla göster
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
