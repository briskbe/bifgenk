/** @type {import('next').NextConfig} */
const nextConfig = {
  // Loaded by Node instead of bundled: react-pdf ships its own React
  // reconciler, and BlockNote's server utilities (used to seed live meeting
  // documents) pull in React client APIs that the server bundle doesn't allow.
  serverExternalPackages: [
    "@react-pdf/renderer",
    "@blocknote/server-util",
    "@blocknote/core",
    "@blocknote/react",
  ],
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
