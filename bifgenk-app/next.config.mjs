/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-pdf ships its own React reconciler and must not be bundled.
  serverExternalPackages: ["@react-pdf/renderer"],
  // Fonts and logo are read from disk when rendering meeting PDFs.
  outputFileTracingIncludes: {
    "/admin/meetings/[id]/pdf": ["./lib/pdf/fonts/**", "./public/logo.png"],
  },
  experimental: {
    // Meeting notes are saved through a server action as JSON.
    serverActions: { bodySizeLimit: "4mb" },
  },
}

export default nextConfig
