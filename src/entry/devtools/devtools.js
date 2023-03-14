import { createApp } from "vue";
import App from "../../view/devtools.vue";
chrome.devtools.panels.create("test-chrome", "", "devtools.html");
createApp(App).mount("#app");
