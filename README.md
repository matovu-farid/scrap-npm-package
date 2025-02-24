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
- 📑 Multi-page scraping and indexing
- 🔒 Secure webhook verification
- 📦 TypeScript support
- 🌐 Cross-platform (Node.js and Deno)

## Usage

The library provides a `ScrapeClient` class for initiating web scraping operations:

```typescript
import { ScrapeClient } from "scrap-ai";

// Initialize the client with your API key and webhook secret
const scrapeClient = new ScrapeClient({
  apiKey: process.env.SCRAP_API_KEY,
  webhookSecret: process.env.WEBHOOK_SECRET,
});

// Start scraping with options
await scrapeClient.scrape({
  url: "https://example.com",
  prompt: "Extract all product titles and prices",
  callbackUrl: "https://your-api.com/webhook",
  maxPages: 10, // Optional: limit number of pages to scrape
  allowedDomains: ["example.com"], // Optional: restrict scraping to specific domains
});
```

## API Reference

### new ScrapeClient(config)

Creates a new scraping client instance.

#### Parameters

| Parameter            | Type   | Description                         |
| -------------------- | ------ | ----------------------------------- |
| config.apiKey        | string | Your API key for authentication     |
| config.webhookSecret | string | Secret key for webhook verification |

### scrapeClient.scrape(options)

Initiates a scraping operation and sends results to the specified callback URL upon completion.

#### Parameters

| Parameter | Type          | Description                                     |
| --------- | ------------- | ----------------------------------------------- |
| options   | ScrapeOptions | Configuration object for the scraping operation |

The ScrapeOptions interface includes:

```typescript
interface ScrapeOptions {
  url: string; // The URL of the webpage to scrape
  prompt: string; // Instructions for what data to extract
  callbackUrl: string; // URL where results will be sent via POST
  maxPages?: number; // Optional: Maximum number of pages to scrape
  allowedDomains?: string[]; // Optional: Array of allowed domains to scrape
}
```

### Webhook Events

The library supports two types of webhook events:

#### Links Event

Received when links are extracted from a page:

```typescript
interface LinksEventData {
  type: "links";
  data: {
    links: string[];
  };
}
```

#### Scraped Event

Received when content is scraped from a page:

```typescript
interface ScrapedEventData {
  type: "scraped";
  data: {
    url: string;
    results: any; // The scraped data in the format specified by the prompt
  };
}
```

### scrapeClient.verifyWebhook(options)

Verifies that a webhook request is authentic using HMAC-SHA256 signature verification.

#### Parameters

| Parameter | Type   | Description                                                 |
| --------- | ------ | ----------------------------------------------------------- |
| body      | string | The raw request body as a string                            |
| signature | string | The signature from x-webhook-signature header               |
| timestamp | string | The timestamp from x-webhook-timestamp header               |
| maxAge?   | number | Maximum age of webhook in milliseconds (default: 5 minutes) |

### scrapeClient.parseWebhookBody(body)

Parses and validates the webhook body.

#### Parameters

| Parameter | Type   | Description                      |
| --------- | ------ | -------------------------------- |
| body      | string | The raw webhook body as a string |

Returns the parsed and validated webhook event.

## Environment Variables

The library requires the following environment variables:

- `SCRAP_API_KEY`: Your API key for authentication
- `WEBHOOK_SECRET`: Your webhook secret key for verifying webhook signatures

## Example Usage

Here's a complete example of how to use the scraping client with webhook verification:

```typescript
import { ScrapeClient } from "scrap-ai";

const scrapeClient = new ScrapeClient({
  apiKey: process.env.SCRAP_API_KEY,
  webhookSecret: process.env.WEBHOOK_SECRET,
});

// Start scraping
async function startScraping() {
  try {
    await scrapeClient.scrape({
      url: "https://example.com",
      prompt: "Extract all product titles, prices, and descriptions",
      callbackUrl: "https://your-api.com/webhook",
      maxPages: 5,
      allowedDomains: ["example.com"],
    });
    console.log("Scraping initiated successfully");
  } catch (error) {
    console.error("Error starting scrape:", error);
  }
}

// Handle webhook
async function handleWebhook(req, res) {
  const body = await getRawBody(req);
  const signature = req.headers["x-webhook-signature"];
  const timestamp = req.headers["x-webhook-timestamp"];

  try {
    // Verify the webhook signature
    scrapeClient.verifyWebhook({ body, signature, timestamp });

    // Parse and process the webhook data
    const event = scrapeClient.parseWebhookBody(body);
    console.log("Received verified webhook:", event);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook verification failed:", error);
    res.status(400).send("Invalid webhook");
  }
}

startScraping();
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```

```
