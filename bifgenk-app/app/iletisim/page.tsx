import fs from "fs";
import path from "path";
import Script from "next/script";

export default function IletisimPage() {
  const htmlPath = path.join(process.cwd(), "public", "landing.html");
  const fullHtml = fs.readFileSync(htmlPath, "utf8");

  // Extract header (navbar)
  const headerMatch = fullHtml.match(
    /(<header class="navbar"[\s\S]*?<\/header>)/i
  );
  const headerHtml = headerMatch ? headerMatch[1] : "";

  // Extract mobile menu (overlay + drawer)
  const mobileOverlay = `<div class="mobile-overlay" id="mobileOverlay"></div>`;
  const drawerMatch = fullHtml.match(
    /(<div class="mobile-drawer"[\s\S]*?<!-- end mobile-drawer -->|<div class="mobile-drawer"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/i
  );
  const drawerHtml = drawerMatch ? drawerMatch[1] : "";

  // Extract footer
  const footerMatch = fullHtml.match(
    /(<footer class="site-footer">[\s\S]*?<\/footer>)/i
  );
  const footerHtml = footerMatch ? footerMatch[1] : "";

  const contactContent = `
    <!-- Hero Section — contained card matching homepage -->
    <section class="iletisim-hero-wrapper">
      <div class="iletisim-hero">
        <div class="iletisim-hero-overlay"></div>
        <div class="iletisim-hero-content">
          <div class="iletisim-hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Bize Ulaşın
          </div>
          <h1>İletişim</h1>
          <p>Sorularınız, önerileriniz veya işbirlikleriniz için bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="iletisim-main">
      <div class="iletisim-grid">
        <!-- Left — Contact Information -->
        <div class="iletisim-info">
          <div class="iletisim-info-header">
            <h2>İletişim Bilgileri</h2>
            <p>Aşağıdaki bilgilerden bize ulaşabilirsiniz.</p>
          </div>

          <div class="iletisim-cards">
            <!-- Address Card -->
            <div class="iletisim-card">
              <div class="iletisim-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="iletisim-card-body">
                <span class="iletisim-card-label">Adres</span>
                <p class="iletisim-card-value">Eikenlaan 34</p>
                <p class="iletisim-card-sub">3600 Genk, Belçika</p>
                <a href="https://www.google.com/maps/dir//Eikenlaan+34,+3600+Genk,+Belgium" target="_blank" rel="noopener noreferrer" class="iletisim-route-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                  Routebeschrijving
                </a>
              </div>
            </div>

            <!-- Phone Card -->
            <div class="iletisim-card">
              <div class="iletisim-card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div class="iletisim-card-body">
                <span class="iletisim-card-label">Telefon</span>
                <a href="tel:+32486839575" class="iletisim-card-value iletisim-card-link">+32 486 83 95 75</a>
                <p class="iletisim-card-sub">Pazartesi - Cuma, 09:00 - 18:00</p>
              </div>
            </div>

            <!-- Email Card -->
            <div class="iletisim-card">
              <div class="iletisim-card-icon iletisim-card-icon-email">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div class="iletisim-card-body">
                <span class="iletisim-card-label">E-posta</span>
                <a href="mailto:info@bifgenclikgenk.be" class="iletisim-card-value iletisim-card-link">info@bifgenclikgenk.be</a>
                <p class="iletisim-card-sub">7/24 e-posta gönderebilirsiniz</p>
              </div>
            </div>

            <!-- WhatsApp Card -->
            <div class="iletisim-card iletisim-card-whatsapp">
              <div class="iletisim-card-icon iletisim-card-icon-wa">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.609l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.25 0-4.336-.637-6.119-1.739l-.427-.262-2.882.966.966-2.882-.262-.427A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </div>
              <div class="iletisim-card-body">
                <span class="iletisim-card-label">WhatsApp</span>
                <a href="https://wa.me/32486839575" target="_blank" rel="noopener noreferrer" class="iletisim-card-value iletisim-card-link">+32 486 83 95 75</a>
                <p class="iletisim-card-sub">Hızlı mesaj gönderin</p>
                <a href="https://wa.me/32486839575" target="_blank" rel="noopener noreferrer" class="iletisim-wa-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.609l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.25 0-4.336-.637-6.119-1.739l-.427-.262-2.882.966.966-2.882-.262-.427A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  WhatsApp ile Mesaj Gönder
                </a>
              </div>
            </div>

            <!-- Contact Person Card -->
            <div class="iletisim-card">
              <div class="iletisim-card-avatar">MK</div>
              <div class="iletisim-card-body">
                <span class="iletisim-card-label">İletişim Sorumlusu</span>
                <p class="iletisim-card-value">Mehmet Kadam</p>
                <p class="iletisim-card-sub">BIF Gençlik Genk Derneği</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right — Map -->
        <div class="iletisim-map-section">
          <div class="iletisim-map-header">
            <h2>Konumumuz</h2>
            <p>Bizi ziyaret edin — Genk şehir merkezine yakın konumdayız.</p>
          </div>

          <div class="iletisim-map-container">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=5.4900%2C50.9600%2C5.5100%2C50.9700&layer=mapnik&marker=50.9650%2C5.5000"
              width="100%"
              height="400"
              style="border:0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="BIF Gençlik Genk Konum"
            ></iframe>
            <div class="iletisim-map-overlay">
              <div class="iletisim-map-pin">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <strong>BIF Gençlik Genk</strong>
                <span>Eikenlaan 34, 3600 Genk</span>
              </div>
            </div>
          </div>

          <div class="iletisim-quick-grid">
            <div class="iletisim-quick-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <h4>Çalışma Saatleri</h4>
              <p>Pzt - Cum: 09:00 - 18:00</p>
            </div>
            <div class="iletisim-quick-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <h4>Topluluk</h4>
              <p>50+ aktif üyemiz var</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section — matching homepage style -->
    <section class="footer-cta-section">
      <div class="footer-cta-bg">
        <div class="footer-cta-orb footer-cta-orb-1"></div>
        <div class="footer-cta-orb footer-cta-orb-2"></div>
        <div class="footer-cta-orb footer-cta-orb-3"></div>
        <div class="footer-cta-grid"></div>
      </div>

      <div class="footer-cta-container">
        <div class="footer-cta-badge">
          <span class="footer-cta-badge-dot"></span>
          Bize Ulaşın
        </div>
        <h2 class="footer-cta-title">Soru mu var?<br><span>Hemen bizimle iletişime geç.</span></h2>
        <p class="footer-cta-desc">WhatsApp, telefon veya e-posta ile bize ulaşabilirsiniz. En kısa sürede size geri dönüş yapacağız.</p>
        <div class="footer-cta-actions">
          <a href="https://wa.me/32486839575" target="_blank" rel="noopener noreferrer" class="footer-cta-btn footer-cta-btn-primary">
            <span class="footer-cta-btn-glow"></span>
            <span class="footer-cta-btn-text">
              WhatsApp ile Yaz
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.609l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.25 0-4.336-.637-6.119-1.739l-.427-.262-2.882.966.966-2.882-.262-.427A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </span>
          </a>
          <a href="tel:+32486839575" class="footer-cta-btn footer-cta-btn-secondary">
            Bizi Arayın
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </a>
        </div>
        <div class="footer-cta-trust">
          <div class="footer-cta-avatars">
            <div class="footer-cta-avatar" style="background: #10b981;">E</div>
            <div class="footer-cta-avatar" style="background: #8b5cf6;">A</div>
            <div class="footer-cta-avatar" style="background: #f59e0b;">M</div>
            <div class="footer-cta-avatar" style="background: #3b82f6;">Y</div>
          </div>
          <span class="footer-cta-trust-text">50+ genç aramıza katıldı</span>
        </div>
      </div>
    </section>
  `;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/site-styles.css" />
      <link rel="stylesheet" href="/iletisim-styles.css" />
      <div
        style={{ fontFamily: "'Nunito', sans-serif" }}
        dangerouslySetInnerHTML={{
          __html:
            headerHtml +
            mobileOverlay +
            drawerHtml +
            contactContent +
            footerHtml,
        }}
      />
      <Script src="/nav-script.js" strategy="afterInteractive" />
    </>
  );
}
