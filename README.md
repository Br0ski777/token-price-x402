# Token Price API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://token-price.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Real-time crypto prices via CoinGecko -- price, 24h change, market cap, volume. 10,000+ tokens supported. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "token-price": {
      "url": "https://token-price.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://token-price.api.klymax402.com/api/price" \
  -H "Content-Type: application/json" \
  -d '{"token":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `finance_get_token_price` | POST | `/api/price` | $0.001 | Get real-time crypto token price with 24h change, market cap, and volume |

### `finance_get_token_price`

Use this when you need the current price of any cryptocurrency or token. Returns real-time market data in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Token name or CoinGecko ID (e.g. bitcoin, ethereum, solana) |
| `currency` | string | no | Target currency for price (default: usd). Supports usd, eur, gbp, etc. |

**Returns**

- `price` -- current price in the requested currency
- `change24h` -- 24-hour price change percentage
- `marketCap` -- total market capitalization in USD
- `volume24h` -- 24-hour trading volume in USD
- `token` -- token identifier used
- `currency` -- target currency for the price

Example response:

```json
{"price":3128.60,"change24h":2.45,"marketCap":376000000000,"volume24h":15200000000,"token":"ethereum","currency":"usd"}
```

**When to use**: quick price lookups, portfolio valuation, and market monitoring. Supports 10,000+ tokens by CoinGecko ID (e.g. bitcoin, ethereum, solana, dogecoin).

**Not for**: stock prices (use `finance_get_stock_price`), token safety (use `token_check_safety`), historical candles (use `token_get_ohlcv_history`), currency conversion (use `finance_convert_currency`).

## Example agent prompts

- "The current price of any cryptocurrency or token"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
