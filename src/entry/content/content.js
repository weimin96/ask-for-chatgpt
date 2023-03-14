console.log("hello world content todo something~");

import { createApp } from "vue";
import App from "@/view/content";

const app = contentApp(App);
app.config.devtools = true;
app.mount("#g-content-app");

function contentApp(element) {
  const div = document.createElement("div");
  div.id = "g-content-app";
  document.body.appendChild(div);
  return createApp(element);
}
