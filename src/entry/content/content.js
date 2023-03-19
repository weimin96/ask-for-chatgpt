import { createApp } from "vue";
import App from "@/view/content";

const app = contentApp(App);
app.config.devtools = true;
app.mount("#g-content-app");

function contentApp(element) {
  const div = document.createElement("g-content-app");
  div.id = "g-content-app";
  document.documentElement.insertBefore(div, document.body);
  return createApp(element);
}
