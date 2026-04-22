"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavProps = {
  active?: "etkinlikler" | "hakkimizda" | "topluluk" | "iletisim" | "haberler";
};

export function SiteNavbar({ active }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [lang, setLang] = useState<"TR" | "NL" | "EN">("TR");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) document.body.classList.add("drawer-open");
    else document.body.classList.remove("drawer-open");
    return () => document.body.classList.remove("drawer-open");
  }, [drawerOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setDrawerOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleGroup = (key: string) =>
    setExpandedGroup((curr) => (curr === key ? null : key));

  return (
    <>
      <header
        className={`navbar${scrolled ? " scrolled" : ""}`}
        id="navbar"
      >
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <img src="/logo.png" alt="Genk Gençlik BIF" className="logo-img" />
          </Link>

          <nav className="nav-menu" id="navMenu">
            <div
              className={`nav-item has-dropdown${active === "etkinlikler" ? " active" : ""}`}
            >
              <button className="nav-link dropdown-toggle">
                Etkinlikler
                <svg className="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="dropdown-menu">
                <a href="/#etkinlikler" className="dropdown-item">
                  <span className="dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="3" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <line x1="9" y1="2" x2="9" y2="6" />
                      <line x1="15" y1="2" x2="15" y2="6" />
                      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                  <div>
                    <strong>Yaklaşan etkinlikler</strong>
                    <p>Neler oluyor, bir bakın</p>
                  </div>
                </a>
                <a href="#" className="dropdown-item">
                  <span className="dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="18" rx="3" />
                      <circle cx="9" cy="10" r="2.5" />
                      <path d="M2 19l5-4.5a2 2 0 0 1 2.5 0l3.5 3" />
                      <path d="M15 15l1.5-1.5a2 2 0 0 1 2.5 0L22 16" />
                    </svg>
                  </span>
                  <div>
                    <strong>Galeri</strong>
                    <p>Anılarımız, kareler halinde</p>
                  </div>
                </a>
                <a href="#" className="dropdown-item">
                  <span className="dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z" />
                    </svg>
                  </span>
                  <div>
                    <strong>Turnuvalar</strong>
                    <p>Spor ve rekabet bir arada</p>
                  </div>
                </a>
              </div>
            </div>

            <div
              className={`nav-item has-dropdown${active === "hakkimizda" ? " active" : ""}`}
            >
              <button className="nav-link dropdown-toggle">
                Hakkımızda
                <svg className="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">
                  <span className="dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10" />
                      <path d="M12 8v4l3 3" />
                      <path d="M17 3.3A9 9 0 0 1 21.7 8" />
                    </svg>
                  </span>
                  <div>
                    <strong>Hikayemiz</strong>
                    <p>Nereden geldik, nereye gidiyoruz</p>
                  </div>
                </a>
                <a href="#" className="dropdown-item">
                  <span className="dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="7" r="3.5" />
                      <circle cx="17" cy="9" r="2.5" />
                      <path d="M2 21c0-4.4 3.6-7 7-7 1.5 0 2.9.4 4 1.2" />
                      <path d="M22 21c0-3-2.2-5.5-5-5.5-1.2 0-2.3.4-3.2 1" />
                    </svg>
                  </span>
                  <div>
                    <strong>Ekibimiz</strong>
                    <p>Yönetim ve gönüllüler</p>
                  </div>
                </a>
              </div>
            </div>

            <div
              className={`nav-item has-dropdown${active === "topluluk" || active === "haberler" ? " active" : ""}`}
            >
              <button className="nav-link dropdown-toggle">
                Topluluk
                <svg className="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="dropdown-menu">
                <Link href="/register" className="dropdown-item">
                  <span className="dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.8 11.1C21.6 9.5 22 7.8 22 6c-4 0-7 1-9 3.5" />
                      <path d="M3.2 11.1C2.4 9.5 2 7.8 2 6c4 0 7 1 9 3.5" />
                      <path d="M12 9.5C12 15 8 19 5 21" />
                      <path d="M12 9.5C12 15 16 19 19 21" />
                      <line x1="12" y1="9.5" x2="12" y2="22" />
                    </svg>
                  </span>
                  <div>
                    <strong>Gönüllü ol</strong>
                    <p>Aramıza katılın</p>
                  </div>
                </Link>
                <Link href="/haberler" className="dropdown-item">
                  <span className="dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9" />
                      <polyline points="22 4 12 14 9 11" />
                    </svg>
                  </span>
                  <div>
                    <strong>Haberler</strong>
                    <p>Son gelişmeler</p>
                  </div>
                </Link>
              </div>
            </div>

            <a
              href="#"
              className={`nav-link${active === "iletisim" ? " active" : ""}`}
            >
              İletişim
            </a>
          </nav>

          <div className="nav-actions">
            <Link href="/login" className="btn-login">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="5.5" r="3" />
                <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
              </svg>
              Üye Girişi
            </Link>
            <Link href="/register" className="btn-cta">Üye Ol</Link>
            <div className="lang-toggle">
              {lang}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <button
            className={`mobile-toggle${drawerOpen ? " active" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div
        className={`mobile-overlay${drawerOpen ? " open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`mobile-drawer${drawerOpen ? " open" : ""}`}>
        <div className="mobile-drawer-header">
          <Link href="/" className="nav-logo">
            <img src="/logo.png" alt="Genk Gençlik BIF" className="logo-img" />
          </Link>
          <button
            className="mobile-close"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        <div className="mobile-drawer-body">
          <nav className="mobile-nav">
            <div className="mobile-nav-group" data-index="0">
              <button
                className={`mobile-nav-heading${expandedGroup === "etkinlikler" ? " expanded" : ""}`}
                onClick={() => toggleGroup("etkinlikler")}
              >
                <div className="mobile-nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="3" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <line x1="9" y1="2" x2="9" y2="6" />
                    <line x1="15" y1="2" x2="15" y2="6" />
                  </svg>
                </div>
                Etkinlikler
                <svg className="mobile-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4 5.5L7 8.5L10 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={`mobile-nav-sub${expandedGroup === "etkinlikler" ? " open" : ""}`}>
                <a href="#">Yaklaşan etkinlikler</a>
                <a href="#">Galeri</a>
                <a href="#">Turnuvalar</a>
              </div>
            </div>

            <div className="mobile-nav-group" data-index="1">
              <button
                className={`mobile-nav-heading${expandedGroup === "hakkimizda" ? " expanded" : ""}`}
                onClick={() => toggleGroup("hakkimizda")}
              >
                <div className="mobile-nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10" />
                    <path d="M12 8v4l3 3" />
                    <path d="M17 3.3A9 9 0 0 1 21.7 8" />
                  </svg>
                </div>
                Hakkımızda
                <svg className="mobile-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4 5.5L7 8.5L10 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={`mobile-nav-sub${expandedGroup === "hakkimizda" ? " open" : ""}`}>
                <a href="#">Hikayemiz</a>
                <a href="#">Ekibimiz</a>
              </div>
            </div>

            <div className="mobile-nav-group" data-index="2">
              <button
                className={`mobile-nav-heading${expandedGroup === "topluluk" ? " expanded" : ""}`}
                onClick={() => toggleGroup("topluluk")}
              >
                <div className="mobile-nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.8 11.1C21.6 9.5 22 7.8 22 6c-4 0-7 1-9 3.5" />
                    <path d="M3.2 11.1C2.4 9.5 2 7.8 2 6c4 0 7 1 9 3.5" />
                    <path d="M12 9.5C12 15 8 19 5 21" />
                    <path d="M12 9.5C12 15 16 19 19 21" />
                    <line x1="12" y1="9.5" x2="12" y2="22" />
                  </svg>
                </div>
                Topluluk
                <svg className="mobile-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4 5.5L7 8.5L10 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={`mobile-nav-sub${expandedGroup === "topluluk" ? " open" : ""}`}>
                <Link href="/register">Gönüllü ol</Link>
                <Link href="/haberler">Haberler</Link>
              </div>
            </div>

            <a href="#" className="mobile-nav-link" data-index="3">
              <div className="mobile-nav-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              İletişim
            </a>
          </nav>

          <div className="mobile-drawer-divider" data-index="4"></div>

          <div className="mobile-drawer-actions" data-index="5">
            <Link href="/register" className="mobile-btn-primary">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="6.5" r="3.5" />
                <path d="M2.5 16c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" strokeLinecap="round" />
              </svg>
              Üye Ol
            </Link>
            <Link href="/login" className="mobile-btn-outline">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="5" width="12" height="10" rx="2" />
                <path d="M6 5V3.5A2.5 2.5 0 0 1 8.5 1h1A2.5 2.5 0 0 1 12 3.5V5" />
                <circle cx="9" cy="10.5" r="1.5" />
              </svg>
              Üye Girişi
            </Link>
          </div>

          <div className="mobile-drawer-footer" data-index="6">
            <div className="mobile-lang-switcher">
              {(["TR", "NL", "EN"] as const).map((code) => (
                <button
                  key={code}
                  className={`mobile-lang${lang === code ? " active" : ""}`}
                  onClick={() => setLang(code)}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
