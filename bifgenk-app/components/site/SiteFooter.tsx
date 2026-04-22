import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <img src="/logo.png" alt="BIF Genk" className="footer-logo-img" />
            </Link>
            <p className="footer-brand-desc">
              Genk&apos;te yaşayan gençleri bir araya getiren, birlikte büyüyen bir topluluk.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.609l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.25 0-4.336-.637-6.119-1.739l-.427-.262-2.882.966.966-2.882-.262-.427A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Keşfet</h4>
            <a href="#">Etkinlikler</a>
            <a href="#">Galeri</a>
            <a href="#">Turnuvalar</a>
            <a href="#">Mescid Sohbetleri</a>
          </div>

          <div className="footer-links-group">
            <h4>Hakkımızda</h4>
            <a href="#">Hikayemiz</a>
            <a href="#">Ekibimiz</a>
            <a href="#">Başkanımız</a>
          </div>

          <div className="footer-links-group">
            <h4>Topluluk</h4>
            <Link href="/haberler">Haberler</Link>
            <Link href="/register">Gönüllü ol</Link>
            <a href="#">İletişim</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 BIF Genk Gençlik. Tüm hakları saklıdır.</p>
          <p className="footer-made">Gençlerden gençlere.</p>
        </div>
      </div>
    </footer>
  );
}
