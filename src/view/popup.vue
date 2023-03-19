<template>
  <div class="main_app">
    <el-form
      :model="form"
      label-width="120px"
      label-position="top"
      class="g-form-container"
    >
      <el-form-item label="AI Provider">
        <template #label>
          <div class="g-form-item-title">AI Provider</div>
          <div class="g-form-item-sub-title">设置默认的API</div>
        </template>
        <el-radio-group v-model="form.aiProvider">
          <el-radio label="ChatGPT">ChatGPT Webapp</el-radio>
          <el-radio label="openAI">openAI API </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.aiProvider === 'openAI'">
        <el-input
          v-model="form.apiKey"
          placeholder="请输入API Key"
          class="g-form-input"
        ></el-input>
        <el-button
          type="primary"
          @click="saveData"
          :disabled="form.aiProvider === 'openAI' && !form.apiKey"
          >保存</el-button
        >
      </el-form-item>
      <el-divider />
    </el-form>
  </div>
</template>

<script>
import "element-plus/dist/index.css";
import { defineComponent } from "vue";

export default defineComponent({
  name: "popupView",
  data() {
    return {
      form: {
        aiProvider: "openAI",
        apiKey: ""
      }
    };
  },
  watch: {
    "form.aiProvider"() {
      this.saveData();
    }
  },
  mounted() {
    chrome.storage.sync.get("setting", (result) => {
      if (result.setting) {
        this.form = result.setting;
      }
    });
  },
  methods: {
    saveData() {
      chrome.storage.sync.set({ setting: this.form }, () => {
        console.log("set successed!");
      });
    }
  }
});
</script>

<style scoped lang="scss">
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 20px;
  width: 350px;
  .g-form-container {
    .g-form-item-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .g-form-item-sub-title {
      font-size: 13px;
      color: #999;
    }
    .g-form-input {
      width: 80%;
      margin-right: 10px;
    }
  }
}
</style>
