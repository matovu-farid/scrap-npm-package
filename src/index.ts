import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { getSigniture } from "./getSigniture.ts";
import { WebHookEvent, webHookSchema } from "./webHooks.ts";
import { ApiMessage } from "./apiMessage.ts";
import { JsonSchema, jsonSchemaSchema } from "./jsonschema.ts";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
export {
  isExploreEventData as isExploreEvent,
  isLinksEventData as isLinksEvent,
  isScrapedEventData as isScrapedEvent,
} from "./webHooks.ts";
/**
 * Options for verifying webhook signatures
 */
export interface WebhookVerificationOptions {
  /** The raw request body as an object */
  body: Object;
  /** The signature from x-webhook-signature header */
  signature: string;
  /** The timestamp from x-webhook-timestamp header */
  timestamp: string;

  /** Maximum age of webhook in milliseconds (default: 5 minutes) */
  maxAge?: number;
}

export class ScrapeClient {
  constructor(private readonly apiKey: string) {}
  /**
   * Scrape a website
   * @param url The URL of the website to scrape
   * @param prompt The prompt to use for the scrape
   * @param callbackUrl The URL to send the scrape results to
   * @returns The scrape results
   */

  async scrape({
    url,
    prompt,
    callbackUrl,
    id,
    schema,
    recursive = true,
  }: {
    url: string;
    prompt: string;
    callbackUrl: string;
    id?: string;
    schema?: z.ZodType<any>;
    recursive?: boolean;
  }) {
    const baseData = {
      url,
      prompt,
      callbackUrl,
      id: id || "",
      recursive,
    };
    let data: ApiMessage = {
      ...baseData,
      type: "text",
    };
    if (schema) {
      const parsedSchema = jsonSchemaSchema.safeParse(schema);

      const jsonSchema = parsedSchema.success
        ? parsedSchema.data
        : (zodToJsonSchema(schema) as JsonSchema);

      if (jsonSchema) {
        data = {
          ...baseData,
          type: "structured",
          schema: jsonSchema,
        };
      }
    }
    try {
      const response = await axios.post(process.env.SCRAP_API_URL!, data, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
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
    const { body, signature, timestamp, maxAge = 50 * 60 * 1000 } = options;
    if (!body) {
      throw new Error("Missing body");
    }
    if (!signature) {
      throw new Error("Missing signature");
    }
    if (!timestamp) {
      throw new Error("Missing timestamp");
    }

    // Verify timestamp is recent
    const timestampMs = Number(timestamp);
    const now = Date.now();
    if (isNaN(timestampMs) || Math.abs(now - timestampMs) > maxAge) {
      console.log({ timestampMs, now, maxAge });
      console.error("Timestamp is not recent");
      return false;
    }

    const expectedSignature = getSigniture(body, this.apiKey, timestamp);

    // Compare signatures using timing-safe equality
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch {
      console.error("Error verifying webhook signature");
      return false;
    }
  }

  /**
   * Parses and validates the webhook body
   *
   * @param body The raw webhook body as a string
   * @returns Parsed and validated webhook body
   * @throws ZodError if the body is invalid
   */
  parseWebhookBody(body: string): WebHookEvent {
    const parsed = JSON.parse(body);
    return webHookSchema.parse(parsed);
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
