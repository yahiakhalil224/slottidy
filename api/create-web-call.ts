// Creates a Retell web call for the "Talk to Sophie" demo and returns a short-lived
// access token to the browser. The Retell API key stays on the server.

const RETELL_WEB_CALL_URL = "https://api.retellai.com/v2/create-web-call"
const DEFAULT_AGENT_ID = "agent_732fbc2465a3c7d967ba49b99d"

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

function accessTokenFrom(payload: unknown) {
  if (typeof payload !== "object" || payload === null || !("access_token" in payload)) return ""
  const token = payload.access_token
  return typeof token === "string" ? token : ""
}

function config() {
  return {
    apiKey: process.env.RETELL_API_KEY?.trim() ?? "",
    agentId: process.env.RETELL_AGENT_ID?.trim() || DEFAULT_AGENT_ID,
  }
}

// Health check: says whether the demo is configured, without revealing any secret.
export async function GET(request: Request) {
  const { apiKey, agentId } = config()
  const status = { configured: apiKey.length > 0, agentIdSource: process.env.RETELL_AGENT_ID ? "env" : "default", agentIdSuffix: agentId.slice(-6) }
  if (!apiKey || !new URL(request.url).searchParams.has("probe")) return json(status)
  // Temporary diagnostic: ask Retell for a web call and report only the outcome, never the token.
  const upstream = await fetch(RETELL_WEB_CALL_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ agent_id: agentId }),
  }).catch((error: unknown) => error)
  if (!(upstream instanceof Response)) return json({ ...status, probe: "network_error", detail: String(upstream).slice(0, 200) })
  const payload: unknown = await upstream.json().catch(() => null)
  const ok = upstream.ok && accessTokenFrom(payload).length > 0
  const detail = ok ? undefined : JSON.stringify(payload).slice(0, 300)
  return json({ ...status, probe: ok ? "ok" : "retell_error", retellStatus: upstream.status, detail })
}

export async function POST() {
  const { apiKey, agentId } = config()
  if (!apiKey) {
    console.error("[create-web-call] RETELL_API_KEY is not set for this deployment")
    return json({ error: "unavailable", reason: "not_configured" }, 500)
  }

  try {
    const upstream = await fetch(RETELL_WEB_CALL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: agentId }),
    })

    const payload: unknown = await upstream.json().catch(() => null)
    const accessToken = accessTokenFrom(payload)
    if (!upstream.ok || accessToken.length === 0) {
      const detail =
        typeof payload === "object" && payload !== null
          ? JSON.stringify(payload).slice(0, 300)
          : String(payload)
      console.error(`[create-web-call] Retell responded ${upstream.status}: ${detail}`)
      return json({ error: "unavailable", reason: "retell_error", status: upstream.status }, 502)
    }

    return json({ access_token: accessToken })
  } catch (error) {
    console.error("[create-web-call] Request to Retell failed:", error instanceof Error ? error.message : error)
    return json({ error: "unavailable", reason: "network" }, 502)
  }
}
