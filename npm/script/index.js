"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postScrapeRequest = void 0;
const axios_1 = __importDefault(require("axios"));
async function postScrapeRequest(url, prompt) {
    const response = await axios_1.default.post(process.env.SCRAP_API_URL || "", {
        body: JSON.stringify({ url, prompt }),
    });
    return response.data;
}
exports.postScrapeRequest = postScrapeRequest;
