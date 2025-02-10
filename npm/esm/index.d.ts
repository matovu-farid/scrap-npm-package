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
}
