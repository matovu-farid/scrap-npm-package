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
- 🔒 Secure API key authentication
- 📦 TypeScript support

## Usage

The library provides a `ScrapeClient` class for initiating web scraping operations and verifying webhook callbacks:

```typescript
import { ScrapeClient } from "scrap-ai";

// Initialize the client with your API key
const scrapeClient = new ScrapeClient(process.env.SCRAP_API_KEY);

// Start scraping
await scrapeClient.scrape(
  "https://example.com",
  "Extract all product titles and prices",
  "https://your-api.com/webhook"
);
```

## API Reference

### new ScrapeClient(apiKey)

Creates a new scraping client instance.

#### Parameters

| Parameter | Type   | Description                     |
| --------- | ------ | ------------------------------- |
| apiKey    | string | Your API key for authentication |

### scrapeClient.scrape(url, prompt, callbackUrl)

Initiates a scraping operation and sends results to the specified callback URL upon completion.

#### Parameters

| Parameter   | Type   | Description                             |
| ----------- | ------ | --------------------------------------- |
| url         | string | The URL of the webpage to scrape        |
| prompt      | string | Instructions for what data to extract   |
| callbackUrl | string | URL where results will be sent via POST |

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
    results: string;
  };
}
```

### scrapeClient.verifyWebhook(options)

Verifies that a webhook request is authentic and recent.

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

The library requires the following environment variable:

- `SCRAP_API_KEY`: Your API key for authentication

## Example Callback Server

Here's a complete example of how to handle webhook events using Express:

```typescript
import express from "express";
import { ScrapeClient, isLinksEvent, isScrapedEvent } from "scrap-ai";

const app = express();
app.use(express.json());

const scrapeClient = new ScrapeClient(process.env.SCRAP_API_KEY);

app.post("/webhook", (req, res) => {
  try {
    // Verify the webhook is authentic
    const isValid = scrapeClient.verifyWebhook({
      body: JSON.stringify(req.body),
      signature: req.headers["x-webhook-signature"] as string,
      timestamp: req.headers["x-webhook-timestamp"] as string,
    });

    if (!isValid) {
      return res.status(401).json({ error: "Invalid webhook" });
    }

    // Parse and validate the webhook body
    const event = scrapeClient.parseWebhookBody(JSON.stringify(req.body));

    // Handle different event types
    if (isLinksEvent(event)) {
      console.log("Received links:", event.data.data.links);
      // Process the extracted links
    } else if (isScrapedEvent(event)) {
      console.log("Received scraped content:", event.data.data.results);
      // Process the scraped content
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```

```
