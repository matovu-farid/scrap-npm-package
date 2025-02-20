import axios from "axios";
import crypto from "crypto";
import { z } from "zod";
export const linksSchema = z.object({
    type: z.literal("links"),
    data: z.object({
        links: z.array(z.string()),
    }),
});
export const scrapedSchema = z.object({
    type: z.literal("scraped"),
    data: z.object({
        url: z.string(),
        results: z.string(),
    }),
});
export const linksEventWebHookSchema = z.object({
    webhook: z.string(),
    data: linksSchema,
    headers: z.record(z.string(), z.string()),
});
export const scrapedEventWebHookSchema = z.object({
    webhook: z.string(),
    data: scrapedSchema,
    headers: z.record(z.string(), z.string()),
});
export const webHookSchema = z.union([
    linksEventWebHookSchema,
    scrapedEventWebHookSchema,
]);
export const isLinksEvent = (event) => {
    return event.data.type === "links";
};
export const isScrapedEvent = (event) => {
    return event.data.type === "scraped";
};
export class ScrapeClient {
    constructor(apiKey) {
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: apiKey
        });
    }
    /**
     * Scrape a website
     * @param url The URL of the website to scrape
     * @param prompt The prompt to use for the scrape
     * @param callbackUrl The URL to send the scrape results to
     * @returns The scrape results
     */
    async scrape(url, prompt, callbackUrl) {
        try {
            const response = await axios.post("https://yfcb5ugk4m.execute-api.af-south-1.amazonaws.com/prod", {
                url,
                prompt,
                callbackUrl,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": this.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
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
    verifyWebhook(options) {
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
            return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
        }
        catch {
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
    parseWebhookBody(body) {
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
