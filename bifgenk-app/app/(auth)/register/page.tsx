"use client";

import { useState } from "react";
import Link from "next/link";
import { register } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result?.error) {
      setError(result.error);
    }

    if (result?.success) {
      setSuccess(result.success);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-400">
        {/* Animated orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-[10%] right-[20%] w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-[15%] left-[10%] w-96 h-96 rounded-full bg-purple-300/20 blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[60%] right-[40%] w-48 h-48 rounded-full bg-fuchsia-200/15 blur-2xl animate-pulse [animation-delay:4s]" />
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

          <div className="space-y-8">
            <h2 className="text-3xl font-bold leading-tight max-w-sm">
              Topluluğa katıl,<br />birlikte büyüyelim.
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Etkinliklere katıl</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Arkadaşlıklar kur</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Birlikte büyü</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/40 text-xs">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-purple-500" />
              <div className="w-6 h-6 rounded-full bg-white/25 border-2 border-purple-500" />
              <div className="w-6 h-6 rounded-full bg-white/30 border-2 border-purple-500" />
            </div>
            <span>50+ genç topluluğa katıldı</span>
          </div>
        </div>
      </div>

      {/* Right — register form */}
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
            <h1 className="text-2xl font-bold tracking-tight">Üye ol</h1>
            <p className="text-muted-foreground text-sm">
              Hesabını oluştur ve BIF Genk ailesine katıl.
            </p>
          </div>

          {success ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-5 py-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Kayıt başarılı!
              </div>
              <p className="text-sm text-emerald-600">{success}</p>
              <Link href="/login">
                <Button variant="outline" className="w-full mt-2">
                  Giriş sayfasına git
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Adın Soyadın"
                  required
                  autoComplete="name"
                  className="h-11"
                />
              </div>

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
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="En az 6 karakter"
                  required
                  autoComplete="new-password"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre tekrar</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Şifreni tekrar gir"
                  required
                  autoComplete="new-password"
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
                    Hesap oluşturuluyor...
                  </span>
                ) : (
                  "Hesap Oluştur"
                )}
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Giriş yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
