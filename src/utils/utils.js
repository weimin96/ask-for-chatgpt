const MAX_INDEX = 2147483647;
export function getMaxZIndex() {
  // 获取当前窗口中所有元素
  const allElements = document.getElementsByTagName("*");

  // 定义变量来跟踪最大的z-index
  let maxZIndex = Number.MIN_SAFE_INTEGER;

  // 循环所有元素，查找具有最大z-index的元素
  for (let i = 0; i < allElements.length; i++) {
    const zIndex = parseInt(
      window.getComputedStyle(allElements[i]).getPropertyValue("z-index")
    );
    if (zIndex > maxZIndex && !isNaN(zIndex)) {
      maxZIndex = zIndex;
    }
  }
  // 输出最大z-index值
  return maxZIndex > MAX_INDEX ? maxZIndex : MAX_INDEX;
}
