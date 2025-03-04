import express from "express";
import bodyParser from "body-parser";
import { isLinksEvent, isScrapedEvent, ScrapeClient } from "../src/index.ts";
import { isLinksEventData, isScrapedEventData } from "../src/webHooks.ts";
import { hash } from "../src/getSigniture.ts";

const app = express();

app.use(bodyParser.json());

app.post("/api/scrape-callback", async (req, res) => {
  const apiUsageKey = process.env.SCRAP_API_KEY!;
  const scrapeClient = new ScrapeClient(apiUsageKey);
  const headersList = req.headers;
  const body = req.body;
  const signature = headersList["x-webhook-signature"] as string;
  const timestamp = headersList["x-webhook-timestamp"] as string;
  const receivedHash = headersList["x-hwebhook-hash"] as string;
  const expectedHash = hash(body);
  console.log({ receivedHash, expectedHash });

  const isValid = scrapeClient.verifyWebhook({
    body,
    signature: signature,
    timestamp: timestamp,
    maxAge: 500 * 60 * 1000, // Optional: customize max age (default 5 minutes)
  });
  console.log({ isValid });
  console.log({ body });

  if (isScrapedEventData(body)) {
    console.log({ results: body.data.results });
  } else if (isLinksEventData(body)) {
    const links = body.data.links;
    const host = body.data.host;
    console.log({ links, host });
  }

  res.send("ok");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
