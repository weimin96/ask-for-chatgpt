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
    <button @click="isShowResultPanel = true">打开弹窗</button>
    <result-panel v-model:visible="isShowResultPanel" @closeModal="hideModal">
      <h1>这是弹窗的标题</h1>
      <p>{{ selectionText }}</p>
    </result-panel>
  </div>
</template>

<script>
import { getMaxZIndex } from "@/utils/utils"
import ResultPanel from "@/content/components/ResultPanel"
import { defineComponent } from "vue"

export default defineComponent({
  name: "MyTranslator",
  components: {
    ResultPanel
  },
  data() {
    return {
      isTranslateVisible: false,
      selectionText: "",
      buttonTop: 0,
      buttonLeft: 0,
      buttonZIndex: 2147483651,
      description: "提示",
      // description: chrome.i18n.getMessage("description")
      isShowResultPanel: false
    }
  },
  mounted() {
    document.addEventListener("mouseup", this.mouseUpHandler.bind(this))
  },
  methods: {
    mouseUpHandler(event) {
      let selection = window.getSelection()
      console.log("selection", selection.toString().trim())
      // 检测是否有选中内容
      if (!selection.isCollapsed) {
        this.selectionText = selection.toString().trim()
        this.isTranslateVisible = true
        // 计算按钮位置
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        this.buttonTop = rect.bottom + window.scrollY + 5
        this.buttonLeft = event.clientX - 20
        this.buttonZIndex = getMaxZIndex()
      } else {
        this.isTranslateVisible = false
      }
    },
    hideModal() {
      this.isShowResultPanel = false
      this.isTranslateVisible = false
    },
    showModal() {
      this.isShowResultPanel = true
      this.isTranslateVisible = false
      document.removeEventListener("mouseup", this.mouseUpHandler.bind(this))
    }
  }
})
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
</style>
