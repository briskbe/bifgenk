"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white text-sm">
              B
            </div>
            <span className="text-lg font-bold tracking-tight">BIF Genk</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400">
        {/* Animated orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] left-[15%] w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[60%] left-[60%] w-48 h-48 rounded-full bg-teal-200/15 blur-2xl animate-pulse [animation-delay:4s]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-6">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Bize Ulasin
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Iletisim
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 leading-relaxed max-w-lg">
              Sorulariniz, onerileriniz veya isbirlikleriniz icin bizimle
              iletisime gecin. Size yardimci olmaktan mutluluk duyariz.
            </p>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80V40C240 0 480 0 720 40C960 80 1200 80 1440 40V80H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Iletisim Bilgileri
              </h2>
              <p className="mt-2 text-muted-foreground">
                Asagidaki bilgilerden bize ulasabilirsiniz.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Address Card */}
              <div className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:-translate-y-0.5">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Adres
                    </h3>
                    <p className="text-lg font-medium">Eikenlaan 34</p>
                    <p className="text-muted-foreground">3600 Genk, Belcika</p>
                    <a
                      href="https://www.google.com/maps/dir//Eikenlaan+34,+3600+Genk,+Belgium"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3"
                    >
                      <Button
                        size="sm"
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="3 11 22 2 13 21 11 13 3 11" />
                        </svg>
                        Routebeschrijving
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:-translate-y-0.5">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Telefon
                    </h3>
                    <a
                      href="tel:+32486839575"
                      className="text-lg font-medium hover:text-emerald-600 transition-colors"
                    >
                      +32 486 83 95 75
                    </a>
                    <p className="text-sm text-muted-foreground">
                      Pazartesi - Cuma, 09:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:-translate-y-0.5">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      E-posta
                    </h3>
                    <a
                      href="mailto:info@bifgenclikgenk.be"
                      className="text-lg font-medium hover:text-emerald-600 transition-colors"
                    >
                      info@bifgenclikgenk.be
                    </a>
                    <p className="text-sm text-muted-foreground">
                      7/24 e-posta gonderebilirsiniz
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Person Card */}
              <div className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:-translate-y-0.5">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    MK
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Iletisim Sorumlusu
                    </h3>
                    <p className="text-lg font-medium">Mehmet Kadam</p>
                    <p className="text-sm text-muted-foreground">
                      BIF Genclik Genk Dernegi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Map */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Konumumuz
              </h2>
              <p className="mt-2 text-muted-foreground">
                Bizi ziyaret edin — Genk sehir merkezine yakin konumdayiz.
              </p>
            </div>

            {/* Map Container */}
            <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-lg">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=5.4900%2C50.9600%2C5.5100%2C50.9700&amp;layer=mapnik&amp;marker=50.9650%2C5.5000"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BIF Genclik Genk Konum"
                className="w-full"
              />

              {/* Map overlay card */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs">
                <div className="bg-white dark:bg-card rounded-xl shadow-xl border border-border/40 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        BIF Genclik Genk
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Eikenlaan 34, 3600 Genk
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 p-5">
                <div className="text-emerald-600 dark:text-emerald-400 mb-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm">Calisma Saatleri</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Pzt - Cum: 09:00 - 18:00
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 p-5">
                <div className="text-emerald-600 dark:text-emerald-400 mb-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm">Topluluk</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  50+ aktif uyemiz var
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 p-10 md:p-16">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-[10%] left-[20%] w-48 h-48 rounded-full bg-teal-200/15 blur-2xl" />
            </div>
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative z-10 text-center max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Toplulugumuza Katilin
              </h2>
              <p className="mt-3 text-white/80">
                BIF Genclik Genk ailesinin bir parcasi olun. Birlikte
                buyuyor, birlikte gucleniyoruz.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-white/90 font-semibold gap-2 shadow-lg"
                  >
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" x2="19" y1="8" y2="14" />
                      <line x1="22" x2="16" y1="11" y2="11" />
                    </svg>
                    Uye Ol
                  </Button>
                </Link>
                <a href="tel:+32486839575">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold gap-2"
                  >
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Bizi Arayin
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white text-xs">
              B
            </div>
            <span className="text-sm text-muted-foreground">
              &copy; 2026 BIF Genclik Genk. Tum haklari saklidir.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <a
              href="mailto:info@bifgenclikgenk.be"
              className="hover:text-foreground transition-colors"
            >
              info@bifgenclikgenk.be
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
