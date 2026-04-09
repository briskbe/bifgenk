import fs from "fs";
import path from "path";
import Script from "next/script";

export default function GonulluOlPage() {
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
    /(<div class="mobile-drawer"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/i
  );
  const drawerHtml = drawerMatch ? drawerMatch[1] : "";

  // Extract footer
  const footerMatch = fullHtml.match(
    /(<footer class="site-footer">[\s\S]*?<\/footer>)/i
  );
  const footerHtml = footerMatch ? footerMatch[1] : "";

  const pageContent = `

    <!-- ============================================
         SECTION 1 — Hero
         ============================================ -->
    <section class="gonullu-hero-wrapper">
      <div class="gonullu-hero">
        <div class="gonullu-hero-overlay"></div>
        <div class="gonullu-hero-content">
          <div class="gonullu-hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Gönüllü Ol
          </div>
          <h1>Birlikte Fark Yaratalım</h1>
          <p>Etkinliklerimize destek ol, topluluğumuza güç kat. Gönüllü olarak aramıza katıl ve birlikte güzel şeyler başaralım.</p>
          <div class="gonullu-hero-actions">
            <a href="#basvuru" class="gonullu-hero-btn-primary">
              Hemen Başvur
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a href="#alanlar" class="gonullu-hero-btn-secondary">Alanları Keşfet</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================
         SECTION 2 — Stats / Impact Bar
         ============================================ -->
    <section class="gonullu-stats-section">
      <div class="gonullu-stats-container">
        <div class="gonullu-stat">
          <span class="gonullu-stat-number">50+</span>
          <span class="gonullu-stat-label">Aktif Gönüllü</span>
        </div>
        <div class="gonullu-stat-divider"></div>
        <div class="gonullu-stat">
          <span class="gonullu-stat-number">30+</span>
          <span class="gonullu-stat-label">Etkinlik / Yıl</span>
        </div>
        <div class="gonullu-stat-divider"></div>
        <div class="gonullu-stat">
          <span class="gonullu-stat-number">5</span>
          <span class="gonullu-stat-label">Gönüllü Alanı</span>
        </div>
        <div class="gonullu-stat-divider"></div>
        <div class="gonullu-stat">
          <span class="gonullu-stat-number">2012</span>
          <span class="gonullu-stat-label">'den beri aktif</span>
        </div>
      </div>
    </section>

    <!-- ============================================
         SECTION 3 — Why Volunteer / Introduction
         ============================================ -->
    <section class="gonullu-why-section">
      <div class="gonullu-why-container">
        <div class="gonullu-why-text">
          <span class="gonullu-section-tag">Neden Gönüllü Olmalısın?</span>
          <h2>Sadece yardım değil, <span>bir aile olmak.</span></h2>
          <p>BIF Gençlik Genk'te gönüllü olmak, sadece etkinliklere destek vermek değil — bir topluluğun parçası olmak, yeni arkadaşlıklar kurmak ve birlikte büyümek demek.</p>
          <div class="gonullu-why-features">
            <div class="gonullu-why-feature">
              <div class="gonullu-why-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <strong>Topluluk</strong>
                <p>Aynı değerleri paylaşan gençlerle tanış</p>
              </div>
            </div>
            <div class="gonullu-why-feature">
              <div class="gonullu-why-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/>
                </svg>
              </div>
              <div>
                <strong>Deneyim</strong>
                <p>Etkinlik organizasyonunda pratik kazan</p>
              </div>
            </div>
            <div class="gonullu-why-feature">
              <div class="gonullu-why-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <strong>Katkı</strong>
                <p>Genk'teki gençlerin hayatına dokunun</p>
              </div>
            </div>
          </div>
        </div>
        <div class="gonullu-why-image">
          <img src="/sohbet.jpg" alt="BIF Genk gönüllü toplantısı" loading="lazy"/>
          <div class="gonullu-why-image-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Birlikte güçlüyüz
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================
         SECTION 4 — Volunteer Areas
         ============================================ -->
    <section class="gonullu-areas-section" id="alanlar">
      <div class="gonullu-areas-container">
        <div class="gonullu-areas-header">
          <span class="gonullu-section-tag">Gönüllü Alanları</span>
          <h2>Sana uygun alanı seç</h2>
          <p>İlgi alanına göre farklı ekiplerde görev alabilirsin. Her alanda sana ihtiyacımız var!</p>
        </div>
        <div class="gonullu-areas-grid">

          <div class="gonullu-area-card">
            <div class="gonullu-area-icon" style="background: #ecfdf5; color: #109B4A;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="9" y1="2" x2="9" y2="6"/>
                <line x1="15" y1="2" x2="15" y2="6"/>
              </svg>
            </div>
            <h3>Etkinlik Organizasyonu</h3>
            <p>Turnuvalar, geziler ve sosyal etkinliklerin planlanması ve yürütülmesinde aktif rol al.</p>
            <span class="gonullu-area-tag">En Popüler</span>
          </div>

          <div class="gonullu-area-card">
            <div class="gonullu-area-icon" style="background: #eff6ff; color: #3b82f6;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="3"/>
                <circle cx="9" cy="10" r="2.5"/>
                <path d="M2 19l5-4.5a2 2 0 0 1 2.5 0l3.5 3"/>
                <path d="M15 15l1.5-1.5a2 2 0 0 1 2.5 0L22 16"/>
              </svg>
            </div>
            <h3>Sosyal Medya & İletişim</h3>
            <p>Instagram, WhatsApp ve diğer kanallardan topluluğumuzu tanıt, içerik üret ve paylaş.</p>
            <span class="gonullu-area-tag">Kreatif</span>
          </div>

          <div class="gonullu-area-card">
            <div class="gonullu-area-icon" style="background: #fef3c7; color: #d97706;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Yeni Üye Karşılama</h3>
            <p>Yeni katılan gençlere rehberlik et, onları topluluğa entegre etmelerine yardımcı ol.</p>
            <span class="gonullu-area-tag">Sosyal</span>
          </div>

          <div class="gonullu-area-card">
            <div class="gonullu-area-icon" style="background: #fce7f3; color: #db2777;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                <line x1="12" y1="6" x2="12" y2="12"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
              </svg>
            </div>
            <h3>Eğitim & Mentorluk</h3>
            <p>Sohbet halkaları, eğitim programları ve kişisel gelişim etkinliklerinde katkıda bulun.</p>
            <span class="gonullu-area-tag">Gelişim</span>
          </div>

          <div class="gonullu-area-card">
            <div class="gonullu-area-icon" style="background: #f3e8ff; color: #7c3aed;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <h3>Spor & Aktivite</h3>
            <p>Futbol turnuvaları, laser game, bowling gibi sportif etkinliklerin koordinasyonu.</p>
            <span class="gonullu-area-tag">Aktif</span>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================
         SECTION 5 — How It Works / Steps
         ============================================ -->
    <section class="gonullu-steps-section">
      <div class="gonullu-steps-container">
        <div class="gonullu-steps-header">
          <span class="gonullu-section-tag">Nasıl Başvurulur?</span>
          <h2>3 adımda gönüllü ol</h2>
          <p>Başvuru süreci çok kolay. Hemen başla!</p>
        </div>
        <div class="gonullu-steps-grid">
          <div class="gonullu-step">
            <div class="gonullu-step-number">1</div>
            <div class="gonullu-step-line"></div>
            <h3>Formu Doldur</h3>
            <p>Aşağıdaki başvuru formunu doldurarak bilgilerini ve ilgi alanlarını bizimle paylaş.</p>
          </div>
          <div class="gonullu-step">
            <div class="gonullu-step-number">2</div>
            <div class="gonullu-step-line"></div>
            <h3>Tanışma Görüşmesi</h3>
            <p>Ekibimiz seninle kısa bir tanışma görüşmesi yaparak seni en uygun alana yönlendirir.</p>
          </div>
          <div class="gonullu-step">
            <div class="gonullu-step-number">3</div>
            <div class="gonullu-step-line"></div>
            <h3>Ekibe Katıl</h3>
            <p>Gönüllü ekibimize katıl, ilk etkinliğinde görev al ve fark yaratmaya başla!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================
         SECTION 6 — Testimonials
         ============================================ -->
    <section class="gonullu-testimonials-section">
      <div class="gonullu-testimonials-container">
        <div class="gonullu-testimonials-header">
          <span class="gonullu-section-tag">Gönüllülerimiz</span>
          <h2>Onlar ne diyor?</h2>
        </div>
        <div class="gonullu-testimonials-grid">
          <div class="gonullu-testimonial">
            <div class="gonullu-testimonial-stars">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
            </div>
            <p class="gonullu-testimonial-text">"BIF Genk'te gönüllü olmak hayatımı değiştirdi. Harika insanlarla tanıştım ve birlikte çok güzel projeler gerçekleştirdik."</p>
            <div class="gonullu-testimonial-author">
              <div class="gonullu-testimonial-avatar" style="background: #10b981;">E</div>
              <div>
                <strong>Enis Ş.</strong>
                <span>Etkinlik Ekibi, 2 yıldır gönüllü</span>
              </div>
            </div>
          </div>

          <div class="gonullu-testimonial">
            <div class="gonullu-testimonial-stars">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
            </div>
            <p class="gonullu-testimonial-text">"Her etkinlikte yeni şeyler öğreniyorum. Genk'te bu kadar güzel bir topluluk olduğunu bilmiyordum. Herkese tavsiye ederim!"</p>
            <div class="gonullu-testimonial-author">
              <div class="gonullu-testimonial-avatar" style="background: #8b5cf6;">A</div>
              <div>
                <strong>Ahmet K.</strong>
                <span>Sosyal Medya Ekibi, 1 yıldır gönüllü</span>
              </div>
            </div>
          </div>

          <div class="gonullu-testimonial">
            <div class="gonullu-testimonial-stars">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><path d="M12 2L15 8.5L22 9.5L17 14.5L18.2 21.5L12 18L5.8 21.5L7 14.5L2 9.5L9 8.5Z"/></svg>
            </div>
            <p class="gonullu-testimonial-text">"İlk defa bir gönüllü çalışmasına katıldım ve çok sıcak karşılandım. Burada herkes birbirine saygılı ve destekçi."</p>
            <div class="gonullu-testimonial-author">
              <div class="gonullu-testimonial-avatar" style="background: #3b82f6;">M</div>
              <div>
                <strong>Murat Y.</strong>
                <span>Spor Ekibi, 6 aydır gönüllü</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================
         SECTION 7 — Application Form
         ============================================ -->
    <section class="gonullu-form-section" id="basvuru">
      <div class="gonullu-form-container">
        <div class="gonullu-form-header">
          <span class="gonullu-section-tag">Başvuru Formu</span>
          <h2>Gönüllü olmak ister misin?</h2>
          <p>Bilgilerini doldur, en kısa sürede seninle iletişime geçelim.</p>
        </div>
        <form class="gonullu-form" action="https://formsubmit.co/info@brisk.be" method="POST">
          <input type="hidden" name="_subject" value="Yeni Gönüllü Başvurusu - BIF Genk"/>
          <input type="hidden" name="_captcha" value="false"/>
          <input type="hidden" name="_next" value="https://bifgenclikgenk.be/gonullu-ol?success=true"/>
          <input type="text" name="_honey" style="display:none"/>
          <div class="gonullu-form-row">
            <div class="gonullu-form-group">
              <label for="gonullu-name">Ad Soyad *</label>
              <input type="text" id="gonullu-name" name="name" placeholder="Örn. Mehmet Kadam" required/>
            </div>
            <div class="gonullu-form-group">
              <label for="gonullu-age">Yaş *</label>
              <input type="number" id="gonullu-age" name="age" placeholder="Örn. 22" required min="14" max="99"/>
            </div>
          </div>
          <div class="gonullu-form-row">
            <div class="gonullu-form-group">
              <label for="gonullu-email">E-posta *</label>
              <input type="email" id="gonullu-email" name="email" placeholder="ornek@email.com" required/>
            </div>
            <div class="gonullu-form-group">
              <label for="gonullu-phone">Telefon *</label>
              <input type="tel" id="gonullu-phone" name="phone" placeholder="+32 4XX XX XX XX" required/>
            </div>
          </div>
          <div class="gonullu-form-group gonullu-form-full">
            <label for="gonullu-area">İlgi Alanın *</label>
            <select id="gonullu-area" name="area" required>
              <option value="" disabled selected>Bir alan seç...</option>
              <option value="etkinlik">Etkinlik Organizasyonu</option>
              <option value="sosyal-medya">Sosyal Medya & İletişim</option>
              <option value="karsilama">Yeni Üye Karşılama</option>
              <option value="egitim">Eğitim & Mentorluk</option>
              <option value="spor">Spor & Aktivite</option>
              <option value="hepsi">Hepsine Açığım</option>
            </select>
          </div>
          <div class="gonullu-form-group gonullu-form-full">
            <label for="gonullu-message">Kendinden Bahset</label>
            <textarea id="gonullu-message" name="message" rows="4" placeholder="Neden gönüllü olmak istiyorsun? Daha önce gönüllü deneyimin var mı?"></textarea>
          </div>
          <button type="submit" class="gonullu-form-submit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 2L11 13"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
            Başvurumu Gönder
          </button>
        </form>
      </div>
    </section>

    <!-- ============================================
         SECTION 8 — CTA (matching homepage style)
         ============================================ -->
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
          Aramıza katıl
        </div>
        <h2 class="footer-cta-title">Bir adım at,<br><span>gerisini birlikte yazalım.</span></h2>
        <p class="footer-cta-desc">BIF Genk Gençlik ailesi seni bekliyor. Etkinliklere katıl, arkadaşlıklar kur, birlikte büyüyelim.</p>
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
          <a href="/iletisim" class="footer-cta-btn footer-cta-btn-secondary">
            İletişim
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
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
      <link rel="stylesheet" href="/gonullu-styles.css" />
      <div
        style={{ fontFamily: "'Nunito', sans-serif" }}
        dangerouslySetInnerHTML={{
          __html:
            headerHtml +
            mobileOverlay +
            drawerHtml +
            pageContent +
            footerHtml,
        }}
      />
      <Script src="/nav-script.js" strategy="afterInteractive" />
    </>
  );
}
