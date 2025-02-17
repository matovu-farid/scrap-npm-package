import { z } from "zod";
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
declare const WebhookBodySchema: z.ZodObject<{
    url: z.ZodString;
    results: z.ZodString;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    url: string;
    results: string;
    timestamp: number;
}, {
    url: string;
    results: string;
    timestamp: number;
}>;
export { WebhookBodySchema };
type WebhookBody = z.infer<typeof WebhookBodySchema>;
export declare class ScrapeClient {
    private readonly apiKey;
    constructor(apiKey: string);
    scrape(url: string, prompt: string, callbackUrl: string): Promise<any>;
    /**
     * Verifies that a webhook request is authentic and recent
     *
     * @param options Webhook verification options
     * @returns boolean indicating if the webhook is valid
     * @throws Error if required parameters are missing
     */
    verifyWebhook(options: WebhookVerificationOptions): boolean;
    /**
     * Parses and validates the webhook body
     *
     * @param body The raw webhook body as a string
     * @returns Parsed and validated webhook body
     * @throws ZodError if the body is invalid
     */
    parseWebhookBody(body: string): WebhookBody;
}
