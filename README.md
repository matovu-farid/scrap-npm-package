# Web Scraping Helper

A lightweight TypeScript library for asynchronous web scraping with customizable prompts and callback support.

## Installation

```bash
# NPM
npm install scrap-ai

# Yarn
yarn add scrap-ai

# Deno
import { ScrapeClient } from "https://deno.land/x/scrap_ai/mod.ts";
```

Then import and use:

```typescript
// ESM/TypeScript
import { ScrapeClient } from "scrap-ai";

// CommonJS
const { ScrapeClient } = require("scrap-ai");
```

## Features

- 🤖 AI-powered data extraction
- 🔄 Asynchronous processing with callback support
- 🔒 Secure webhook verification
- 📦 TypeScript support
- 🌐 Cross-platform (Node.js and Deno)
- 📊 Optional structured data extraction with Zod schemas

## Usage

The library provides a `ScrapeClient` class for initiating web scraping operations:

```typescript
import { ScrapeClient } from "scrap-ai";

// Initialize the client with your API key
const scrapeClient = new ScrapeClient(process.env.SCRAP_API_KEY);

// Basic scraping
await scrapeClient.scrape(
  "https://example.com",
  "Extract all product titles and prices",
  "https://your-api.com/webhook"
);

// Scraping with structured data using Zod schema
import { z } from "zod";

const productSchema = z.object({
  title: z.string(),
  price: z.number(),
});

await scrapeClient.scrape(
  "https://example.com",
  "Extract product information",
  "https://your-api.com/webhook",
  "optional-custom-id",
  productSchema
);
```

## API Reference

### new ScrapeClient(apiKey)

Creates a new scraping client instance.

#### Parameters

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| apiKey    | string | Your API key for authentication |

### scrapeClient.scrape(url, prompt, callbackUrl, id?, schema?)

Initiates a scraping operation and sends results to the specified callback URL upon completion.

#### Parameters

| Parameter   | Type      | Description                                         |
| ----------- | --------- | --------------------------------------------------- |
| url         | string    | The URL of the webpage to scrape                    |
| prompt      | string    | Instructions for what data to extract               |
| callbackUrl | string    | URL where results will be sent via POST             |
| id?         | string    | Optional custom identifier for the scraping request |
| schema?     | z.ZodType | Optional Zod schema for structured data extraction  |

### Webhook Verification

The library provides webhook verification to ensure the authenticity of incoming webhook requests:

```typescript
const isValid = scrapeClient.verifyWebhook({
  body: req.body,
  signature: req.headers["x-webhook-signature"],
  timestamp: req.headers["x-webhook-timestamp"],
});
```

### scrapeClient.verifyWebhook(options)

Verifies that a webhook request is authentic using timing-safe signature comparison.

#### Parameters

| Parameter         | Type   | Description                                                 |
| ----------------- | ------ | ----------------------------------------------------------- |
| options.body      | Object | The raw request body as an object                           |
| options.signature | string | The signature from x-webhook-signature header               |
| options.timestamp | string | The timestamp from x-webhook-timestamp header               |
| options.maxAge?   | number | Maximum age of webhook in milliseconds (default: 5 minutes) |

### scrapeClient.parseWebhookBody(body)

Parses and validates the webhook body.

#### Parameters

| Parameter | Type   | Description                      |
| --------- | ------ | -------------------------------- |
| body      | string | The raw webhook body as a string |

Returns the parsed and validated webhook event.

## Example Usage with Express

Here's a complete example of how to use the scraping client with webhook verification in an Express application:

```typescript
import { ScrapeClient } from "scrap-ai";
import express from "express";

const app = express();
const scrapeClient = new ScrapeClient(process.env.SCRAP_API_KEY);

// Webhook endpoint
app.post("/webhook", express.json(), (req, res) => {
  const isValid = scrapeClient.verifyWebhook({
    body: req.body,
    signature: req.headers["x-webhook-signature"] as string,
    timestamp: req.headers["x-webhook-timestamp"] as string,
  });

  if (!isValid) {
    return res.status(400).send("Invalid webhook signature");
  }

  const event = scrapeClient.parseWebhookBody(JSON.stringify(req.body));
  console.log("Received verified webhook:", event);

  res.status(200).send("OK");
});

// Start scraping
app.post("/start-scrape", async (req, res) => {
  try {
    const result = await scrapeClient.scrape(
      "https://example.com",
      "Extract product information",
      "https://your-api.com/webhook"
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Scraping failed" });
  }
});
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```

```
