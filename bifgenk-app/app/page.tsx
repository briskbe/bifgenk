import fs from "fs";
import path from "path";
import Script from "next/script";

export default function HomePage() {
  const htmlPath = path.join(process.cwd(), "public", "landing.html");
  const fullHtml = fs.readFileSync(htmlPath, "utf8");

  // Extract body content (between <body> and </body>)
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : "";

  // Remove inline script tags (we load them via next/script)
  const cleanBody = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/site-styles.css" />
      <div
        style={{ fontFamily: "'Nunito', sans-serif" }}
        dangerouslySetInnerHTML={{ __html: cleanBody }}
      />
      <Script src="/site-script.js" strategy="afterInteractive" />
    </>
  );
}
