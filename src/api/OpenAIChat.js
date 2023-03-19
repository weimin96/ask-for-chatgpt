const fetch = require("node-fetch");

export class OpenAIChat {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiEndpoint = "https://api.openai.com/v1/chat/completions";
  }

  async getChatCompletion(prompt, model, temperature) {
    const requestData = {
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: temperature
    };

    const response = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();
    console.log(data);

    return data.choices[0].message.content;
  }
}
