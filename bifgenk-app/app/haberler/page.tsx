import Script from "next/script";
import { SiteNavbar } from "@/components/site/SiteNavbar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NewsExplorer } from "./NewsExplorer";
import { NewsletterForm } from "./NewsletterForm";
import { CATEGORY_LABELS, articles } from "./news-data";

export const metadata = {
  title: "Haberler — BIF Genk Gençlik",
  description:
    "BIF Genk Gençlik topluluğundan son haberler, duyurular, etkinlikler ve mescid sohbetleri.",
};

export default function HaberlerPage() {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const nonFeatured = articles.filter((a) => a.slug !== featured.slug);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/site-styles.css" />

      <div style={{ fontFamily: "'Nunito', sans-serif" }}>
        <SiteNavbar active="haberler" />

        {/* Hero */}
        <section className="news-hero-wrapper">
          <div className="news-hero">
            <div className="news-hero-bg" aria-hidden>
              <div className="news-hero-orb news-hero-orb-1" />
              <div className="news-hero-orb news-hero-orb-2" />
              <div className="news-hero-grid" />
            </div>

            <div className="news-hero-content">
              <span className="news-hero-badge">
                <span className="news-hero-badge-dot" />
                Canlı güncellemeler
              </span>
              <h1 className="news-hero-title">
                Topluluğumuzdan <span>son haberler</span>
              </h1>
              <p className="news-hero-subtitle">
                Etkinlikler, duyurular, mescid sohbetleri ve başkandan mesajlar — BIF Genk Gençlik
                topluluğunda olup biten her şey tek bir yerde.
              </p>

              <div className="news-hero-stats">
                <div className="news-hero-stat">
                  <span className="news-hero-stat-num">{articles.length}</span>
                  <span className="news-hero-stat-label">yayında haber</span>
                </div>
                <div className="news-hero-stat-sep" />
                <div className="news-hero-stat">
                  <span className="news-hero-stat-num">6</span>
                  <span className="news-hero-stat-label">kategori</span>
                </div>
                <div className="news-hero-stat-sep" />
                <div className="news-hero-stat">
                  <span className="news-hero-stat-num">Her hafta</span>
                  <span className="news-hero-stat-label">yeni içerik</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured article */}
        <section className="news-featured-wrapper">
          <div className="news-featured-container">
            <div className="news-section-heading">
              <span className="news-section-kicker">Öne çıkan</span>
              <h2 className="news-section-title">Bu hafta en çok konuşulan</h2>
            </div>

            <a
              href={`/haberler/${featured.slug}`}
              className="news-featured-card"
            >
              <div className="news-featured-media">
                <img src={featured.image} alt="" />
                <span className={`news-card-chip chip-${featured.category}`}>
                  {CATEGORY_LABELS[featured.category]}
                </span>
              </div>
              <div className="news-featured-body">
                <div className="news-card-meta">
                  <time dateTime={featured.date}>{featured.dateLabel}</time>
                  <span className="news-card-dot" aria-hidden />
                  <span>{featured.readMinutes} dk okuma</span>
                </div>
                <h3
                  className="news-featured-title"
                  dangerouslySetInnerHTML={{ __html: featured.title }}
                />
                <p
                  className="news-featured-excerpt"
                  dangerouslySetInnerHTML={{ __html: featured.excerpt }}
                />
                <div className="news-card-footer">
                  <span className="news-card-author">
                    <span className="news-card-avatar" aria-hidden>
                      {featured.author.charAt(0)}
                    </span>
                    {featured.author}
                  </span>
                  <span className="news-card-cta news-card-cta-strong">
                    Haberi oku
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Filterable grid */}
        <NewsExplorer articles={nonFeatured} />

        {/* Newsletter */}
        <section className="news-newsletter-wrapper">
          <div className="news-newsletter">
            <div className="news-newsletter-inner">
              <div className="news-newsletter-icon" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </div>
              <div className="news-newsletter-text">
                <h3>Hiçbir haberi kaçırma</h3>
                <p>
                  Haftalık bültenimize katıl — etkinlikler, duyurular ve topluluk hikâyeleri
                  doğrudan gelen kutuna gelsin.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>

      {/* Hero stat counter animation (reuses .stat-number pattern) */}
      <Script id="news-reveal" strategy="afterInteractive">
        {`
          (function () {
            var obs = new IntersectionObserver(function (entries) {
              entries.forEach(function (e) {
                if (e.isIntersecting) {
                  e.target.classList.add('visible');
                  obs.unobserve(e.target);
                }
              });
            }, { threshold: 0.15 });
            document.querySelectorAll('.news-card, .news-featured-card, .news-hero-content').forEach(function (el) {
              obs.observe(el);
            });
          })();
        `}
      </Script>
    </>
  );
}
