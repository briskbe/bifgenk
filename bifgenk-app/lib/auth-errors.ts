import { isAPIError } from "better-auth/api";

const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-posta veya şifre hatalı.",
  INVALID_EMAIL: "Geçerli bir e-posta adresi gir.",
  PASSWORD_TOO_SHORT: "Şifre en az 6 karakter olmalı.",
  PASSWORD_TOO_LONG: "Şifre çok uzun.",
  USER_ALREADY_EXISTS: "Bu e-posta adresiyle kayıtlı bir hesap zaten var.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Bu e-posta adresiyle kayıtlı bir hesap zaten var.",
  YOU_CANNOT_BAN_YOURSELF: "Kendi hesabını askıya alamazsın.",
  YOU_CANNOT_REMOVE_YOURSELF: "Kendi hesabını silemezsin.",
};

/** Turns a Better Auth error into a Turkish message safe to show in the UI. */
export function authErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    const code = error.body?.code;
    if (code === "BANNED_USER") return error.body?.message ?? "Hesabın askıya alındı.";
    if (code && MESSAGES[code]) return MESSAGES[code];
  }
  console.error(error);
  return "Bir hata oluştu. Lütfen tekrar dene.";
}
