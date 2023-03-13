import axios from "axios";
import { createParser } from "eventsource-parser";

// const KEY_ACCESS_TOKEN = "accessToken"
const CHATGPT_SESSION_API = "https://chat.openai.com/api/auth/session";
// const CHATGPT_BACKEND_API = "https://chat.openai.com/backend-api/conversation"

export async function getAccessToken() {
  const resp = await fetch("https://chat.openai.com/api/auth/session", {
    mode: "no-cors"
  })
    .then((r) => r.json())
    .catch(() => ({}));
  if (!resp.accessToken) {
    throw new Error("UNAUTHORIZED");
  }
  return resp.accessToken;
}

export async function getChatGPTAccessToken() {
  const resp = await axios
    .get(CHATGPT_SESSION_API, { withCredentials: true })
    .then((response) => {
      return response.data.accessToken;
    })
    .catch(() => {});
  if (!resp.accessToken) {
    throw new Error("UNAUTHORIZED");
  }
  return resp;
}

export function getChatGPTAnswer(accessToken) {
  axios.create({
    baseURL: CHATGPT_BACKEND_API,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function fetchSSE(resource, options) {
  const { onMessage, ...fetchOptions } = options;
  const resp = await fetch(resource, fetchOptions);
  const parser = createParser((event) => {
    if (event.type === "event") {
      onMessage(event.data);
    }
  });
  for await (const chunk of streamAsyncIterable(resp.body)) {
    const str = new TextDecoder().decode(chunk);
    parser.feed(str);
  }
}

export async function* streamAsyncIterable(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
