import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "token-price",
  slug: "token-price",
  description: "Real-time crypto prices via CoinGecko -- price, 24h change, market cap, volume. 10,000+ tokens supported.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/price",
      price: "$0.001",
      description: "Get real-time crypto token price with 24h change, market cap, and volume",
      toolName: "finance_get_token_price",
      toolDescription: `Use this when you need the current price of any cryptocurrency or token. Returns real-time market data in JSON.

1. price: current price in the requested currency
2. change24h: 24-hour price change percentage
3. marketCap: total market capitalization in USD
4. volume24h: 24-hour trading volume in USD
5. token: token identifier used
6. currency: target currency for the price

Example output: {"price":3128.60,"change24h":2.45,"marketCap":376000000000,"volume24h":15200000000,"token":"ethereum","currency":"usd"}

Use this FOR quick price lookups, portfolio valuation, and market monitoring. Supports 10,000+ tokens by CoinGecko ID (e.g. bitcoin, ethereum, solana, dogecoin).

Do NOT use for stock prices -- use finance_get_stock_price instead. Do NOT use for token safety -- use token_check_safety instead. Do NOT use for historical candles -- use token_get_ohlcv_history instead. Do NOT use for currency conversion -- use finance_convert_currency instead.`,
      inputSchema: {
        type: "object",
        properties: {
          token: { type: "string", description: "Token name or CoinGecko ID (e.g. bitcoin, ethereum, solana)" },
          currency: { type: "string", description: "Target currency for price (default: usd). Supports usd, eur, gbp, etc." },
        },
        required: ["token"],
      },
      outputSchema: {
          "type": "object",
          "properties": {
            "token": {
              "type": "string",
              "description": "Token identifier"
            },
            "currency": {
              "type": "string",
              "description": "Price currency"
            },
            "price": {
              "type": "number",
              "description": "Current price"
            },
            "change24h": {
              "type": "number",
              "description": "24h price change percent"
            },
            "marketCap": {
              "type": "number",
              "description": "Market capitalization"
            },
            "volume24h": {
              "type": "number",
              "description": "24h trading volume"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "token",
            "price"
          ]
        },
    },
  ],
};
