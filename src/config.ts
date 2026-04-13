import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "token-price",
  slug: "token-price",
  description: "Real-time crypto token prices from CoinGecko — price, 24h change, market cap, volume.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/price",
      price: "$0.001",
      description: "Get real-time crypto token price with 24h change, market cap, and volume",
      toolName: "finance_get_token_price",
      toolDescription: "Use this when you need the current price of a cryptocurrency or token. Input a token name or ID (e.g. bitcoin, ethereum, solana, dogecoin) and optional currency (default USD). Returns current price, 24h price change percentage, market cap, and 24h trading volume. Supports 10,000+ tokens via CoinGecko. Do NOT use for stock prices — use finance_get_stock_price instead. Do NOT use for token safety — use crypto_check_token_safety instead.",
      inputSchema: {
        type: "object",
        properties: {
          token: { type: "string", description: "Token name or CoinGecko ID (e.g. bitcoin, ethereum, solana)" },
          currency: { type: "string", description: "Target currency for price (default: usd). Supports usd, eur, gbp, etc." },
        },
        required: ["token"],
      },
    },
  ],
};
