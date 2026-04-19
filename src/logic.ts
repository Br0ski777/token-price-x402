import type { Hono } from "hono";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

export function registerRoutes(app: Hono) {
  app.post("/api/price", async (c) => {
    await tryRequirePayment(0.001);
    const body = await c.req.json().catch(() => null);
    if (!body?.token) {
      return c.json({ error: "Missing required field: token" }, 400);
    }

    const token = body.token.toLowerCase().trim();
    const currency = (body.currency || "usd").toLowerCase().trim();

    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(token)}&vs_currencies=${encodeURIComponent(currency)}&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
      const resp = await fetch(url, {
        headers: {
          "Accept": "application/json",
        },
      });

      if (!resp.ok) {
        return c.json({ error: `CoinGecko returned ${resp.status}` }, 502);
      }

      const data = await resp.json() as any;
      const tokenData = data[token];

      if (!tokenData) {
        // Try search API to find the token
        const searchResp = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(token)}`);
        if (searchResp.ok) {
          const searchData = await searchResp.json() as any;
          const coins = searchData?.coins?.slice(0, 5).map((c: any) => c.id) || [];
          return c.json({
            error: `Token '${token}' not found. Did you mean: ${coins.join(", ")}? Use the CoinGecko ID (e.g. 'bitcoin', not 'BTC').`,
          }, 404);
        }
        return c.json({ error: `Token '${token}' not found. Use CoinGecko ID (e.g. 'bitcoin', 'ethereum').` }, 404);
      }

      return c.json({
        token,
        currency,
        price: tokenData[currency] ?? null,
        change24h: tokenData[`${currency}_24h_change`] ?? null,
        marketCap: tokenData[`${currency}_market_cap`] ?? null,
        volume24h: tokenData[`${currency}_24h_vol`] ?? null,
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      return c.json({ error: `Failed to fetch token price: ${e.message}` }, 500);
    }
  });
}
