import ExpiryMap from "expiry-map";
import { guid, isEmpty } from "@/utils/utils";
import { createParser } from "eventsource-parser";
import { OpenAIChat } from "@/api/OpenAIChat";

const cache = new ExpiryMap(10 * 1000);
const ACCESS_TOKEN_KEY = "access_token";

async function main() {
  try {
    chrome.runtime.onConnect.addListener((port) => {
      console.log("收到来自content-script的连接");
      port.onMessage.addListener(async (msg) => {
        console.info("接收消息", msg);
        try {
          const setting = await getSetting();
          if (setting) {
            if (setting.aiProvider === "openAI") {
              const apiKey = setting.apiKey;
              await new OpenAIChat(apiKey)
                .getChatCompletion(msg.question, "gpt-3.5-turbo", 0.7)
                .then((answer) => {
                  console.log("answer", answer);
                  port.postMessage({ answer });
                })
                .catch((error) => console.error(error));
            }
          } else {
            await getChatGPTAnswer(msg.question, (answer) => {
              port.postMessage({ answer });
            });
          }
        } catch (err) {
          console.error(err);
          port.postMessage({ error: err.message });
          cache.delete(ACCESS_TOKEN_KEY);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

main();

const CHATGPT_SESSION_API = "https://chat.openai.com/api/auth/session";
const CHATGPT_BACKEND_API = "https://chat.openai.com/backend-api/conversation";

async function getAccessToken() {
  if (cache.get(ACCESS_TOKEN_KEY)) {
    return cache.get(ACCESS_TOKEN_KEY);
  }
  const response = await fetch(CHATGPT_SESSION_API);
  if (response.status === 200) {
    const data = await response.json().catch(() => ({}));
    const accessToken = data.accessToken;
    if (accessToken) {
      cache.set(ACCESS_TOKEN_KEY, accessToken);
      return accessToken;
    }
  }
  throw new Error("UNAUTHORIZED");
}

async function getChatGPTAnswer(question, callback) {
  const accessToken = await getAccessToken();
  await fetchSSE(CHATGPT_BACKEND_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      action: "next",
      messages: [
        {
          id: guid(),
          role: "user",
          content: {
            content_type: "text",
            parts: [question]
          }
        }
      ],
      model: "text-davinci-002-render-sha",
      parent_message_id: guid()
    }),
    onMessage(message) {
      console.debug("sse message", message);
      if (message === "[DONE]") {
        callback("[FINISH]");
        return;
      }
      try {
        const data = JSON.parse(message);
        const text = data.message?.content?.parts?.[0];
        if (text) {
          callback(text);
        }
      } catch (err) {
        // console.error(err);
      }
    }
  });
}

export async function fetchSSE(resource, options) {
  const { onMessage, ...fetchOptions } = options;
  const resp = await fetch(resource, fetchOptions);
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(
      !isEmpty(error)
        ? JSON.stringify(error)
        : `${resp.status} ${resp.statusText}`
    );
  }
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

async function* streamAsyncIterable(stream) {
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

function getSetting() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("setting", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.setting);
      }
    });
  });
}
