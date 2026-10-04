import type { IncomingMessage, ServerResponse } from "node:http"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite"
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

function localWebCall(): Plugin {
  return {
    name: "local-web-call",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir, "RETELL_")
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value
      }

      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split("?")[0]
        if (pathname !== "/api/create-web-call") {
          next()
          return
        }
        void serveWebCall(server, req, res)
      })
    },
  }
}

async function serveWebCall(server: ViteDevServer, req: IncomingMessage, res: ServerResponse) {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405
      res.setHeader("Allow", "POST")
      res.setHeader("Content-Type", "application/json; charset=utf-8")
      res.end(JSON.stringify({ error: "Method not allowed" }))
      return
    }

    const loaded = (await server.ssrLoadModule("/api/create-web-call.ts")) as {
      POST?: () => Promise<Response>
    }
    if (!loaded.POST) throw new Error("Missing web call handler")

    const response = await loaded.POST()
    res.statusCode = response.status
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })
    res.end(Buffer.from(await response.arrayBuffer()))
  } catch {
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader("Content-Type", "application/json; charset=utf-8")
    }
    res.end(JSON.stringify({ error: "unavailable" }))
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta(), localWebCall()],
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
