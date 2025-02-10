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

#### Callback Response

Your callback URL will receive a POST request with the following data structure:

```typescript
interface CallbackResponse {
  status: "success" | "error";
  data?: {
    url: string;
    results: any[];
    timestamp: string;
  };
  error?: {
    message: string;
    code: string;
  };
}
```

## Environment Variables

The library requires the following environment variable:

- `SCRAP_API_KEY`: Your API key for authentication

## Example Callback Server

Here's a simple example of how to handle the callback response using Express:

```typescript
import express from "express";
import { ScrapeClient } from "scrap-ai";

const app = express();
app.use(express.json());

const scrapeClient = new ScrapeClient(process.env.SCRAP_API_KEY);

app.post("/webhook", (req, res) => {
  // Verify the webhook is authentic
  const isValid = scrapeClient.verifyWebhook({
    body: JSON.stringify(req.body),
    signature: req.headers["x-webhook-signature"],
    timestamp: req.headers["x-webhook-timestamp"],
    maxAge: 5 * 60 * 1000, // Optional: customize max age (default 5 minutes)
  });

  if (!isValid) {
    return res.status(401).json({ error: "Invalid webhook" });
  }

  const { status, data, error } = req.body;

  if (status === "success") {
    console.log("Scraping results:", data);
    // Process the scraped data
  } else {
    console.error("Scraping error:", error);
    // Handle the error
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});
```

## Setting Up Your Callback Endpoint

Your callback endpoint should:

1. Accept POST requests
2. Parse JSON body
3. Handle both success and error responses
4. Return a 200 status code to acknowledge receipt
5. Verify webhook signatures to ensure authenticity

Security considerations:

- Verify the webhook signature using your API key
- Check the timestamp to prevent replay attacks
- Use HTTPS for secure data transmission
- Validate the incoming data structure
- Set appropriate request timeout limits

### Webhook Authentication

Each webhook request includes the following headers:

| Header                | Description                                                                         |
| --------------------- | ----------------------------------------------------------------------------------- |
| `x-webhook-signature` | HMAC SHA-256 signature of `${timestamp}.${JSON.stringify(body)}` using your API key |
| `x-webhook-timestamp` | Unix timestamp when the webhook was sent                                            |

To verify the webhook:

1. Get the signature and timestamp from headers
2. Concatenate the timestamp and JSON body with a period
3. Create an HMAC SHA-256 of this string using your API key
4. Compare the generated signature with the one in the header
5. Verify the timestamp is recent (within 5 minutes) to prevent replay attacks

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```

```
