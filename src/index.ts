import axios from "axios";

export async function postScrapeRequest(url: string, prompt: string) {
  const response = await axios.post(process.env.SCRAP_API_URL || "", {
    body: JSON.stringify({ url, prompt }),
  });
  return response.data;
}
