"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapeClient = exports.isScrapedEvent = exports.isLinksEvent = exports.webHookSchema = exports.scrapedEventWebHookSchema = exports.linksEventWebHookSchema = exports.scrapedSchema = exports.linksSchema = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const zod_1 = require("zod");
exports.linksSchema = zod_1.z.object({
    type: zod_1.z.literal("links"),
    data: zod_1.z.object({
        links: zod_1.z.array(zod_1.z.string()),
        host: zod_1.z.string(),
    }),
});
exports.scrapedSchema = zod_1.z.object({
    type: zod_1.z.literal("scraped"),
    data: zod_1.z.object({
        url: zod_1.z.string(),
        results: zod_1.z.string(),
    }),
});
exports.linksEventWebHookSchema = zod_1.z.object({
    webhook: zod_1.z.string(),
    data: exports.linksSchema,
    headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
});
exports.scrapedEventWebHookSchema = zod_1.z.object({
    webhook: zod_1.z.string(),
    data: exports.scrapedSchema,
    headers: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
});
exports.webHookSchema = zod_1.z.union([
    exports.linksEventWebHookSchema,
    exports.scrapedEventWebHookSchema,
]);
const isLinksEvent = (event) => {
    return event.data.type === "links";
};
exports.isLinksEvent = isLinksEvent;
const isScrapedEvent = (event) => {
    return event.data.type === "scraped";
};
exports.isScrapedEvent = isScrapedEvent;
class ScrapeClient {
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
            const response = await axios_1.default.post("https://yfcb5ugk4m.execute-api.af-south-1.amazonaws.com/prod", {
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
        const expectedSignature = crypto_1.default
            .createHmac("sha256", this.apiKey)
            .update(`${timestamp}.${body}`)
            .digest("hex");
        // Compare signatures using timing-safe equality
        try {
            return crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
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
        return exports.webHookSchema.parse(parsed);
    }
}
exports.ScrapeClient = ScrapeClient;
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
