<template>
  <div class="content_page">
    <Translator />
  </div>
</template>

<script>
import Translator from "@/entry/content/components/Translator";
import "element-plus/dist/index.css";

export default {
  name: "ContentApp",
  components: {
    Translator
  }
};
</script>

<style scoped></style>
