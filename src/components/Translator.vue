<template>
  <div class="g-translator-btn-container" v-if="isTranslateVisible"
       :style="{ top: buttonTop + 'px', left: buttonLeft + 'px' }">
    <div class="g-translator-btn-layout">
      <div class="g-translator-btn-tooltip" :tip="$t('message.iconTip')">
        <div class="g-translator-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "MyTranslator",
  components: {

  },
  data() {
    return {
      isTranslateVisible: false,
      selectionText: '',
      buttonTop: 0,
      buttonLeft: 0
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.mouseUpHandler.bind(this))
    // const { onMouseUp, changeDirectSetting, onEscDown, toggleInput } = this
    // document.addEventListener('mouseup', onMouseUp)
    // document.addEventListener('keydown', changeDirectSetting)
    // document.addEventListener('keydown', toggleInput)
    // document.addEventListener('keydown', onEscDown)
    // document.addEventListener('contextMenuClick', e => {
    //   onMouseUp({ clientX: 0, clientY: 0, pageY: 0 }, e.detail.text)
    // })
  },
  methods: {
    // 划词监听
    mouseUpHandler(event) {
      let selection = window.getSelection();
      console.log('selection', selection.toString().trim())
      // 检测是否有选中内容
      if (!selection.isCollapsed) {
        this.selectionText = selection.toString().trim()
        this.isTranslateVisible = true
        // 计算按钮位置
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        this.buttonTop = rect.bottom
        this.buttonLeft = event.clientX;
      } else {
        this.isTranslateVisible = false
      }
    },
    // hidePanelInRoot() {
    //   this.resultAsDialog = false
    //   this.hidePanel()
    // },
    // showPanelAsDialog(text) {
    //   this.selection = text
    //   this.resultAsDialog = true
    //   this.position = _calcPositionAsDialog()
    //   this.showPanel(text)
    // },
    // onEscDown(e) {
    //   if (e.keyCode === 27) {
    //     this.hidePanel()
    //     this.hideInput()
    //   }
    // },
  }
}
</script>

<style lang="scss" scoped>
.g-translator-btn-container {
  position: absolute;
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
