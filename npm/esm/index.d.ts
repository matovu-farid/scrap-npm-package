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
export declare const linksSchema: z.ZodObject<{
    type: z.ZodLiteral<"links">;
    data: z.ZodObject<{
        links: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        links: string[];
    }, {
        links: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    type: "links";
    data: {
        links: string[];
    };
}, {
    type: "links";
    data: {
        links: string[];
    };
}>;
export declare const scrapedSchema: z.ZodObject<{
    type: z.ZodLiteral<"scraped">;
    data: z.ZodObject<{
        url: z.ZodString;
        results: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        results: string;
    }, {
        url: string;
        results: string;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "scraped";
    data: {
        url: string;
        results: string;
    };
}, {
    type: "scraped";
    data: {
        url: string;
        results: string;
    };
}>;
export type LinksEventData = z.infer<typeof linksSchema>;
export type ScrapedEventData = z.infer<typeof scrapedSchema>;
export declare const linksEventWebHookSchema: z.ZodObject<{
    webhook: z.ZodString;
    data: z.ZodObject<{
        type: z.ZodLiteral<"links">;
        data: z.ZodObject<{
            links: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            links: string[];
        }, {
            links: string[];
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "links";
        data: {
            links: string[];
        };
    }, {
        type: "links";
        data: {
            links: string[];
        };
    }>;
    headers: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data: {
        type: "links";
        data: {
            links: string[];
        };
    };
    webhook: string;
    headers: Record<string, string>;
}, {
    data: {
        type: "links";
        data: {
            links: string[];
        };
    };
    webhook: string;
    headers: Record<string, string>;
}>;
export declare const scrapedEventWebHookSchema: z.ZodObject<{
    webhook: z.ZodString;
    data: z.ZodObject<{
        type: z.ZodLiteral<"scraped">;
        data: z.ZodObject<{
            url: z.ZodString;
            results: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            results: string;
        }, {
            url: string;
            results: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    }, {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    }>;
    headers: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data: {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    };
    webhook: string;
    headers: Record<string, string>;
}, {
    data: {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    };
    webhook: string;
    headers: Record<string, string>;
}>;
export declare const webHookSchema: z.ZodUnion<[z.ZodObject<{
    webhook: z.ZodString;
    data: z.ZodObject<{
        type: z.ZodLiteral<"links">;
        data: z.ZodObject<{
            links: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            links: string[];
        }, {
            links: string[];
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "links";
        data: {
            links: string[];
        };
    }, {
        type: "links";
        data: {
            links: string[];
        };
    }>;
    headers: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data: {
        type: "links";
        data: {
            links: string[];
        };
    };
    webhook: string;
    headers: Record<string, string>;
}, {
    data: {
        type: "links";
        data: {
            links: string[];
        };
    };
    webhook: string;
    headers: Record<string, string>;
}>, z.ZodObject<{
    webhook: z.ZodString;
    data: z.ZodObject<{
        type: z.ZodLiteral<"scraped">;
        data: z.ZodObject<{
            url: z.ZodString;
            results: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            results: string;
        }, {
            url: string;
            results: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    }, {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    }>;
    headers: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    data: {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    };
    webhook: string;
    headers: Record<string, string>;
}, {
    data: {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    };
    webhook: string;
    headers: Record<string, string>;
}>]>;
export type WebHookEvent = z.infer<typeof webHookSchema>;
export type WebHookEventData = z.infer<typeof webHookSchema>["data"];
export declare const isLinksEvent: (event: WebHookEvent) => event is {
    data: {
        type: "links";
        data: {
            links: string[];
        };
    };
    webhook: string;
    headers: Record<string, string>;
};
export declare const isScrapedEvent: (event: WebHookEvent) => event is {
    data: {
        type: "scraped";
        data: {
            url: string;
            results: string;
        };
    };
    webhook: string;
    headers: Record<string, string>;
};
export declare class ScrapeClient {
    private readonly apiKey;
    constructor(apiKey: string);
    /**
     * Scrape a website
     * @param url The URL of the website to scrape
     * @param prompt The prompt to use for the scrape
     * @param callbackUrl The URL to send the scrape results to
     * @returns The scrape results
     */
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
    parseWebhookBody(body: string): WebHookEvent;
}
