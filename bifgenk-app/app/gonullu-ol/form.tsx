"use client";

import { useState } from "react";

export default function GonulluForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formsubmit.co/ajax/info@brisk.be", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success === "true" || json.success === true) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="gonullu-form-section" id="basvuru">
      <div className="gonullu-form-container">
        <div className="gonullu-form-header">
          <span className="gonullu-section-tag">Başvuru Formu</span>
          <h2>Gönüllü olmak ister misin?</h2>
          <p>Bilgilerini doldur, en kısa sürede seninle iletişime geçelim.</p>
        </div>

        {status === "success" ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 24px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#109B4A",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ color: "#109B4A", fontSize: "1.25rem", margin: "0 0 8px" }}>
              Başvurun alındı!
            </h3>
            <p style={{ color: "#555", margin: 0, fontSize: "0.95rem" }}>
              En kısa sürede seninle iletişime geçeceğiz. Teşekkürler!
            </p>
          </div>
        ) : (
          <form className="gonullu-form" onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="Yeni Gönüllü Başvurusu - BIF Genk" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: "none" }} />

            <div className="gonullu-form-row">
              <div className="gonullu-form-group">
                <label htmlFor="gonullu-name">Ad Soyad *</label>
                <input type="text" id="gonullu-name" name="name" placeholder="Örn. Mehmet Kadam" required />
              </div>
              <div className="gonullu-form-group">
                <label htmlFor="gonullu-age">Yaş *</label>
                <input type="number" id="gonullu-age" name="age" placeholder="Örn. 22" required min={14} max={99} />
              </div>
            </div>

            <div className="gonullu-form-row">
              <div className="gonullu-form-group">
                <label htmlFor="gonullu-email">E-posta *</label>
                <input type="email" id="gonullu-email" name="email" placeholder="ornek@email.com" required />
              </div>
              <div className="gonullu-form-group">
                <label htmlFor="gonullu-phone">Telefon *</label>
                <input type="tel" id="gonullu-phone" name="phone" placeholder="+32 4XX XX XX XX" required />
              </div>
            </div>

            <div className="gonullu-form-group gonullu-form-full">
              <label htmlFor="gonullu-area">İlgi Alanın *</label>
              <select id="gonullu-area" name="area" required defaultValue="">
                <option value="" disabled>Bir alan seç...</option>
                <option value="etkinlik">Etkinlik Organizasyonu</option>
                <option value="sosyal-medya">Sosyal Medya &amp; İletişim</option>
                <option value="karsilama">Yeni Üye Karşılama</option>
                <option value="egitim">Eğitim &amp; Mentorluk</option>
                <option value="spor">Spor &amp; Aktivite</option>
                <option value="hepsi">Hepsine Açığım</option>
              </select>
            </div>

            <div className="gonullu-form-group gonullu-form-full">
              <label htmlFor="gonullu-message">Kendinden Bahset</label>
              <textarea
                id="gonullu-message"
                name="message"
                rows={4}
                placeholder="Neden gönüllü olmak istiyorsun? Daha önce gönüllü deneyimin var mı?"
              />
            </div>

            {status === "error" && (
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                }}
              >
                <strong style={{ color: "#dc2626" }}>Bir hata oluştu.</strong>{" "}
                <span style={{ color: "#555" }}>Lütfen tekrar dene veya WhatsApp ile ulaş.</span>
              </div>
            )}

            <button type="submit" className="gonullu-form-submit" disabled={status === "sending"}>
              {status === "sending" ? (
                "Gönderiliyor..."
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                  Başvurumu Gönder
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
