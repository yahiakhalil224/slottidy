import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { organizationJsonLd, site, siteTitle } from "./src/config/site.ts"

function siteMeta(): Plugin {
  const jsonLd = JSON.stringify(organizationJsonLd()).replace(/</g, "\\u003c")
  return {
    name: "site-meta",
    transformIndexHtml(html) {
      return html
        .replaceAll("%TITLE%", siteTitle)
        .replaceAll("%DESCRIPTION%", site.description)
        .replaceAll("%CANONICAL%", site.canonical)
        .replaceAll("%JSONLD%", jsonLd)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 4327,
    strictPort: true,
    allowedHosts: true,
  },
})
