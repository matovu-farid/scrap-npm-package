import axios from "axios";
import crypto from "crypto";
/**
 * Options for verifying webhook signatures
 */
export interface WebhookVerificationOptions {
  /** The raw request body as a string */
  body: string;
  /** The signature from x-webhook-signature header */
  signature: string;
  /** The timestamp from x-webhook-timestamp header */
  timestamp: string;

  /** Maximum age of webhook in milliseconds (default: 5 minutes) */
  maxAge?: number;
}
export class ScrapeClient {
  constructor(private readonly apiKey: string) {}
  async scrape(url: string, prompt: string, callbackUrl: string) {
    try {
    const response = await axios.post(
      "https://yfcb5ugk4m.execute-api.af-south-1.amazonaws.com/prod",
      {
        url,
        prompt,
        callbackUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
      }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Verifies that a webhook request is authentic and recent
   *
   * @param options Webhook verification options
   * @returns boolean indicating if the webhook is valid
   * @throws Error if required parameters are missing
   */
  verifyWebhook(options: WebhookVerificationOptions): boolean {
    const { body, signature, timestamp, maxAge = 5 * 60 * 1000 } = options;

    if (!body || !signature || !timestamp || !this.apiKey) {
      throw new Error("Missing required webhook verification parameters");
    }

    // Verify timestamp is recent
    const timestampMs = Number(timestamp);
    const now = Date.now();
    if (isNaN(timestampMs) || Math.abs(now - timestampMs) > maxAge) {
      return false;
    }

    // Calculate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", this.apiKey)
      .update(`${timestamp}.${body}`)
      .digest("hex");

    // Compare signatures using timing-safe equality
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }
}

//  Example usage with Express:
// const scrapeClient = new ScrapeClient(process.env.SCRAP_API_KEY || "");

// verify webhook
// const isValid = scrapeClient.verifyWebhook({
//   body: JSON.stringify(req.body),
//   signature: req.headers["x-webhook-signature"],
//   timestamp: req.headers["x-webhook-timestamp"],
//   maxAge,
// });

// scrape
// const scrape = await scrapeClient.scrape("https://www.google.com", "scrape the page", "https://example.com/callback");

// Full Express Example
// const scrapeClient = new ScrapeClient(process.env.SCRAP_API_KEY || "");

// // Middleware to verify webhook
// const webhookMiddleware = scrapeClient.createWebhookMiddleware(
//   process.env.SCRAP_WEBHOOK_SECRET || "",
//   process.env.SCRAP_WEBHOOK_MAX_AGE || "5m"
// );