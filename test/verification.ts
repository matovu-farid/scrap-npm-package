import express from "express";
import bodyParser from "body-parser";
import { ScrapeClient } from "../src/index.ts";

const app = express();

app.use(bodyParser.json());

app.post("/api/scrape-callback", async (req, res) => {
  const apiUsageKey = process.env.SCRAP_API_KEY!;
  const scrapeClient = new ScrapeClient(apiUsageKey);
  const headersList = req.headers;
  const body = req.body;
  const signature = headersList["x-webhook-signature"] as string;
  const timestamp = headersList["x-webhook-timestamp"] as string;

  const isValid = scrapeClient.verifyWebhook({
    body: JSON.stringify(body),
    signature: signature,
    timestamp: timestamp,
    maxAge: 500 * 60 * 1000, // Optional: customize max age (default 5 minutes)
  });
  console.log({ isValid });

  res.send("ok");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
