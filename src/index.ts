import axios from "axios";

export async function scrape(
  url: string,
  prompt: string,
  callbackUrl: string,
  credentials: { apiKey: string }
) {
  const response = await axios.post(process.env.SCRAP_API_URL || "", {
    body: JSON.stringify({ url, prompt, callbackUrl }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": credentials.apiKey,
    },
  });
}
