<template>
  <div>
    <div
      class="g-translator-container"
      v-if="isTranslateVisible"
      :style="{
        top: buttonTop + 'px',
        left: buttonLeft + 'px',
        'z-index': buttonZIndex
      }"
    >
      <div
        class="g-translator-btn-layout"
        @mouseup.stop="(e) => e"
        @click.stop="showModal"
      >
        <div class="g-translator-btn-tooltip" :tip="description">
          <div class="g-translator-btn"></div>
        </div>
      </div>
    </div>
    <!--    <result-panel
      v-model:visible="isShowResultPanel"
      @closeModal="hideModal"
      :style="{
        top: buttonTop + 'px',
        left: buttonLeft + 'px',
        'z-index': buttonZIndex
      }"
    >
    </result-panel>-->

    <el-drawer
      v-model="isDrawerShow"
      direction="rtl"
      :before-close="hideModal"
      :show-close="false"
      :modal="false"
      :lock-scroll="false"
    >
      <template #header>
        <div class="modal-header">
          <div class="modal-logo">
            <img :src="logo" alt="logo" width="16" height="16" />
            <div class="modal-title">{{ name }}</div>
          </div>
        </div>
      </template>
      <div class="panel-container">
        <div class="text-area-container">
          <textarea
            placeholder="请输入句子..."
            v-model="selectionText"
          ></textarea>
        </div>
        <div class="input-container">
          <input
            type="text"
            placeholder="请输入提问..."
            v-model="questionText"
          />
          <button @click="sendMessage" :disabled="isLoading">
            <img v-if="!isLoading" :src="sendIcon" alt="发送" />
            <div v-if="isLoading" class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
        <div class="result-layout">
          <p>{{ answer }}</p>
          <p v-if="error1">
            请先登录 <a href="https://chat.openai.com">chat.openai.com！</a>
          </p>
          <p v-if="error2">Failed to load response from ChatGPT</p>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getMaxZIndex } from "@/utils/utils";
import ResultPanel from "@/entry/content/components/ResultPanel";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MyTranslator",
  components: {},
  data() {
    return {
      isTranslateVisible: false,
      selectionText: "",
      buttonTop: 0,
      buttonLeft: 0,
      buttonZIndex: 2147483651,
      // description: "提示",
      description: chrome.i18n.getMessage("description"),
      isShowResultPanel: false,
      answer: "",
      sendIcon: require("@/assets/send.png"),
      questionText: "请解释：",
      isLoading: false,
      error1: false,
      error2: false,

      isDrawerShow: false,
      logo: require("@/assets/icon-48.png"),
      name: chrome.i18n.getMessage("name")
    };
  },
  mounted() {
    console.log("mounted");
    document.addEventListener("mouseup", this.mouseUpHandler);
  },
  methods: {
    mouseUpHandler(event) {
      let selection = window.getSelection();
      console.log("selection", selection.toString().trim());
      // 检测是否有选中内容
      if (!selection.isCollapsed) {
        this.selectionText = selection.toString().trim();
        this.isTranslateVisible = true;
        // 计算按钮位置
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        this.buttonTop = rect.bottom + window.scrollY + 5;
        this.buttonLeft = event.clientX - 20;
        this.buttonZIndex = getMaxZIndex();
      } else {
        this.isTranslateVisible = false;
      }
    },
    hideModal() {
      this.isShowResultPanel = false;
      this.isTranslateVisible = false;
      document.addEventListener("mouseup", this.mouseUpHandler);
      document.removeEventListener("click", this.hideModal);
      this.answer = "";
      this.questionText = "请解释：";
      this.isLoading = false;
      //
      this.isDrawerShow = false;
    },
    showModal() {
      this.isDrawerShow = true;
      // this.isShowResultPanel = true;
      this.isTranslateVisible = false;
      document.removeEventListener("mouseup", this.mouseUpHandler);
      document.addEventListener("click", this.hideModal);
    },
    sendMessage() {
      this.answer = "";
      this.error1 = false;
      this.error2 = false;
      const that = this;
      const port = chrome.runtime.connect();
      port.onMessage.addListener(function (msg) {
        if (msg.answer) {
          if (msg.answer === "[FINISH]") {
            that.isLoading = false;
          } else {
            that.answer = msg.answer;
            that.isLoading = false;
          }
        } else if (msg.error === "UNAUTHORIZED") {
          that.error1 = true;
          that.isLoading = false;
        } else {
          that.error2 = true;
          that.isLoading = false;
        }
      });
      this.isLoading = true;
      port.postMessage({ question: this.questionText + this.selectionText });
    }
  }
});
</script>

<style lang="scss" scoped>
.g-translator-container {
  position: absolute;
  z-index: 2147483651;

  .g-translator-btn-layout {
    position: relative;
    padding: 3px;
    background: #fff;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.16);
    border-radius: 50px;
    font-family: inherit;
    display: flex;
    user-select: none;
    cursor: pointer;

    .g-translator-btn-tooltip {
      position: relative;
      display: inline-block;

      &::before {
        content: attr(tip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding: 7px;
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.75);
        color: #fff;
        font-size: 12px;
        white-space: nowrap;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
      }

      &:hover::before {
        visibility: visible;
        opacity: 1;
      }

      .g-translator-btn {
        width: 16px;
        height: 16px;
        background-image: url("~@/assets/icon-48.png");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        cursor: pointer;
        padding: 3px;
      }
    }
  }
}

.panel-container {
  .text-area-container {
    display: flex;
    margin-bottom: 10px;
    textarea {
      flex: 1;
      background-color: #f2f2f2;
      border: none;
      padding: 4px 8px;
      font-size: 13px;
      font-family: Arial, sans-serif;
      resize: both;
      line-height: 1.6em;
      height: 90px;
      &:focus {
        background-color: #ffffff;
        border: 2px solid #525252;
        outline: none;
      }
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 4px;
    height: 26px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 13px;
    }
    button {
      background-color: transparent;
      transition: background-color 0.3s ease-in-out;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      line-height: 26px;
      display: flex;
      align-items: center;
      padding: 4px;
      &:hover {
        background-color: rgba(17, 20, 24, 0.15);
      }
      img {
        height: 13px;
      }
    }

    .loading-dots {
      display: flex;
      align-items: center;
      width: 16px;
      height: 16px;
      span {
        background-color: #222222;
        margin-left: 2px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        opacity: 0.4;
        animation: loading-dots-animation 1s infinite ease-in-out;
        &:nth-child(1) {
          animation-delay: 0ms;
        }
        &:nth-child(2) {
          animation-delay: 150ms;
        }
        &:nth-child(3) {
          animation-delay: 300ms;
        }
      }
      @keyframes loading-dots-animation {
        0% {
          transform: scale(0);
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    }
  }

  .result-layout {
    margin-top: 10px;
    max-height: 200px;
    overflow-y: auto;
    line-height: 1.3;
    font-size: 14px;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .modal-logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: auto;
    img {
      margin-right: 5px;
    }
    .modal-title {
      margin: 0;
      font-size: 14px;
    }
  }
  .modal-close {
    background-color: transparent;
    border: none;
    color: #ccc;
    font-size: 1.5em;
    cursor: pointer;
    &:hover {
      color: #000;
    }
  }
}
</style>
