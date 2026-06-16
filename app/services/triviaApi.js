import axios from "axios";

const triviaClient = axios.create({
  baseURL: "https://opentdb.com",
  timeout: 10000, // 10 seconds
});

// Helper for sleep/delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchCategories = async () => {
  const response = await triviaClient.get("/api_category.php");
  return response.data.trivia_categories;
};

export const fetchQuestions = async (params, retryCount = 0) => {
  try {
    const response = await triviaClient.get("/api.php", {
      params: {
        ...params,
        encode: "url3986",
      },
    });

    // Handle Rate Limit (Code 5) as per GEMINI.md
    if (response.data.response_code === 5 && retryCount < 3) {
      console.warn("Trivia API Rate Limit (Code 5). Retrying in 5 seconds...");
      await sleep(5000);
      return fetchQuestions(params, retryCount + 1);
    }

    if (response.data.response_code === 0) {
      return response.data.results;
    }

    throw new Error(`Trivia API Error: Code ${response.data.response_code}`);
  } catch (error) {
    if (error.response?.status === 429 && retryCount < 3) {
      console.warn("HTTP 429 Rate Limit. Retrying in 5 seconds...");
      await sleep(5000);
      return fetchQuestions(params, retryCount + 1);
    }
    throw error;
  }
};

export default triviaClient;
