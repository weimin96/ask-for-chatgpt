<template>
  <a-button type="primary">Primary Button</a-button>
  <a-button>Default Button</a-button>
  <a-button type="dashed">Dashed Button</a-button>
  <a-button type="text">Text Button</a-button>
  <a-button type="link">Link Button</a-button>
  <div class="aaa">11 1111111111111111 1111111111111111你是谁</div>
  <Translator />
</template>

<script>
import Translator from "@/content/components/Translator";

export default {
  name: "App",
  components: {
    Translator
  }
};
</script>

<style lang="scss" scoped>
.aaa {
  color: red;
}
</style>
