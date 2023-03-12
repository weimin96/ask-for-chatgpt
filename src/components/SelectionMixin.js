export default {
  computed: {
    buttonPositionStyle() {
      const { buttonX, buttonY } = this.position
      return {
        left: buttonX,
        top: buttonY
      }
    },

    panelPositionStyle() {
      const { panelX, panelY, isTop, maxHeight } = this.position

      return {
        left: panelX,
        maxHeight,
        top: panelY,
        transform: `translateY(${isTop ? 0 : "-100%"})`
      }
    },

    resultPanelVisible() {
      const { panelVisible, selection, translateLoaded } = this
      let result = translateLoaded && panelVisible && selection

      return result
    }
  },
  data() {
    return {
      selection: "",
      panelVisible: true,
      translateLoaded: false,
      position: {
        panelX: 0,
        panelY: 0,
        buttonX: 0,
        buttonY: 0,
        maxHeight: 0,
        isTop: true
      },

      translationResult: Object.create(null),

      hasKeyboardDisplayControl: false,

      showPanelDirectlyWhatever: false
    }
  },
  methods: {
    /**
     * 监听 MouseUp 事件来怕段划词完成，触发情况有两种：划词、双击
     * ! 注意这里是 async
     */
    async onMouseUp(e, selectionText) {
      if (e.button === 0 || selectionText) {
        const text = selectionText || window.getSelection().toString().trim()

        this.selection = text

        this.position = _calcPosition(e)

        if (text) {
          console.log("text", text)
        }
      }
    }
  }
}

const _calcPosition = (e) => {
  let x
  let y
  let maxHeight
  let isTop = true
  const { clientX, clientY, pageY } = e

  const { innerHeight, innerWidth } = window

  const offsetX = innerWidth - clientX - 550

  if (offsetX <= 0) {
    x = clientX + offsetX - 30
  } else {
    x = clientX - 10
  }

  // 大于百分之六指高度时弹框出现在上面
  if (clientY > innerHeight * 0.6) {
    isTop = false
    y = pageY - 30
    maxHeight = innerHeight - (innerHeight - clientY + 30) - 10
  } else {
    y = pageY + 15
    maxHeight = innerHeight - (clientY + 15) - 10
  }

  return {
    panelX: x + "px",
    panelY: y + "px",
    buttonX: clientX + "px",
    buttonY: pageY + 15 + "px",
    isTop,
    maxHeight: maxHeight + "px"
  }
}
