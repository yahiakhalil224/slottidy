// Creates a Retell web call for the "Talk to Sophie" demo and returns a short-lived
// access token to the browser. The Retell API key stays on the server.

// v2 was retired by Retell on 2026-09-30; v3 also returns the browser connection details.
const RETELL_WEB_CALL_URL = "https://api.retellai.com/v3/create-web-call"
const DEFAULT_AGENT_ID = "agent_732fbc2465a3c7d967ba49b99d"

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

function accessTokenFrom(payload: unknown) {
  if (typeof payload !== "object" || payload === null || !("access_token" in payload)) return ""
  const token = payload.access_token
  return typeof token === "string" ? token : ""
}

// Only the fields the browser needs to join the call.
function connectionFrom(payload: unknown) {
  const record = typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : {}
  return {
    access_token: accessTokenFrom(payload),
    call_id: typeof record.call_id === "string" ? record.call_id : undefined,
    transport: typeof record.transport === "string" ? record.transport : undefined,
    ice_servers: Array.isArray(record.ice_servers) ? record.ice_servers : undefined,
  }
}

function config() {
  return {
    apiKey: process.env.RETELL_API_KEY?.trim() ?? "",
    agentId: process.env.RETELL_AGENT_ID?.trim() || DEFAULT_AGENT_ID,
  }
}

// Health check: says whether the demo is configured, without revealing any secret.
export function GET() {
  const { apiKey } = config()
  return json({ configured: apiKey.length > 0 })
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

    return json(connectionFrom(payload))
  } catch (error) {
    console.error("[create-web-call] Request to Retell failed:", error instanceof Error ? error.message : error)
    return json({ error: "unavailable", reason: "network" }, 502)
  }
}
