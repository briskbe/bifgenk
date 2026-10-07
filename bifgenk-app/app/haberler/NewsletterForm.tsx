"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="news-newsletter-success" role="status">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Teşekkürler! Bültenimize abone oldun.
      </div>
    );
  }

  return (
    <form className="news-newsletter-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="newsletter-email">
        E-posta
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="E-posta adresin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">
        Abone ol
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
