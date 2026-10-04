const RETELL_WEB_CALL_URL = "https://api.retellai.com/v2/create-web-call"
const RETELL_AGENT_ID = "agent_732fbc2465a3c7d967ba49b99d"

function accessTokenFrom(payload: unknown) {
  if (typeof payload !== "object" || payload === null || !("access_token" in payload)) return ""
  const token = payload.access_token
  return typeof token === "string" ? token : ""
}

export async function POST() {
  const apiKey = process.env.RETELL_API_KEY?.trim()
  if (!apiKey) {
    return Response.json({ error: "unavailable" }, { status: 500 })
  }

  try {
    const upstream = await fetch(RETELL_WEB_CALL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: RETELL_AGENT_ID }),
    })

    const payload: unknown = await upstream.json().catch(() => null)
    const accessToken = accessTokenFrom(payload)
    if (!upstream.ok || accessToken.length === 0) {
      return Response.json({ error: "unavailable" }, { status: 502 })
    }

    return Response.json(
      { access_token: accessToken },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 })
  }
}
