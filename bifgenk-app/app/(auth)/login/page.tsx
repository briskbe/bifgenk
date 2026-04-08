"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400">
        {/* Animated orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[20%] w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[50%] left-[50%] w-48 h-48 rounded-full bg-teal-200/15 blur-2xl animate-pulse [animation-delay:4s]" />
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

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-lg">
                B
              </div>
              <span className="text-xl font-bold tracking-tight">BIF Genk</span>
            </div>
          </div>

          <div className="space-y-6">
            <blockquote className="text-2xl font-bold leading-snug max-w-md">
              "Birlikte büyüyor,<br />birlikte güçleniyoruz."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-sm font-bold">
                E
              </div>
              <div>
                <p className="font-semibold text-sm">Enis Şahin</p>
                <p className="text-white/60 text-xs">BIF Genk Gençlik Başkanı</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/40 text-xs">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-emerald-500" />
              <div className="w-6 h-6 rounded-full bg-white/25 border-2 border-emerald-500" />
              <div className="w-6 h-6 rounded-full bg-white/30 border-2 border-emerald-500" />
            </div>
            <span>50+ genç topluluğa katıldı</span>
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
              B
            </div>
            <span className="text-lg font-bold">BIF Genk</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Tekrar hoş geldin</h1>
            <p className="text-muted-foreground text-sm">
              Hesabına giriş yap ve topluluğa devam et.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@email.com"
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link
                  href="#"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Şifreni mi unuttun?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Hesabın yok mu?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Üye ol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
