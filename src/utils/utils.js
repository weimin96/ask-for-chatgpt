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

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isEmpty(obj) {
  // 如果obj为null或undefined，认为它是空的
  if (obj == null) {
    return true;
  }

  // 如果obj是字符串或数组，通过检查它们的长度来判断是否为空
  if (typeof obj === "string" || Array.isArray(obj)) {
    return obj.length === 0;
  }

  // 如果obj是对象，通过检查它的属性个数来判断是否为空
  if (typeof obj === "object") {
    return Object.keys(obj).length === 0;
  }

  // 其他类型的值默认视为非空
  return false;
}
