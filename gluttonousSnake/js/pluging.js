/*
 * @Author: @Guojufeng 
 * @Date: 2018-12-14 16:22:28 
 * @Last Modified by: @Guojufeng
 * @Last Modified time: 2019-02-01 18:06:37
 */
var xingorg1Utils = {
  /* 获取随机颜色值 */
  getRandomColor: () => {
    var color = '#',
      arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    for (var i = 0; i < 6; i++) {
      var random = Math.floor(Math.random() * 16);
      color += arr[random];
    }
    return color;
  },
  getRedRandomColor: () => {
    // 生成红色范围的颜色值
    var color = '#ff',
      arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    for (var i = 0; i < 4; i++) {
      var random = Math.floor(Math.random() * 16);
      color += arr[random];
    }
    return color;
  },
  /*
   * 添加事件
   * @param {variable} element 元素
   * @param {string} type 事件类型
   * @param {function} handler 回调函数
   */
  addHander: (element, type, handler) => {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },
  /*
   * 移除事件
   * @param {variable} element 要移除事件的元素
   * @param {string} type 事件类型
   * @param {function} handler 回调函数
   */
  removeHander: (element, type, handler) => {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },
  getEvent: (event) => {
    return event ? event : window.event;
  },
  /*
   * 获取事件的类型
   * @param {variable} event 
   */
  getType: (event) => {
    return event.type;
  },
  /*
   * 获取事件来自于哪个元素
   * @param {variable} event 
   */
  getElement: (event) => {
    return event.target || event.srcElement;
  },
  /*
   * 阻止、取消事件的默认行为|属性发生
   * @param {variable} event 
   */
  preventDefault: (event) => {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = null;
    }
  },
  /*
   * 阻止冒泡行为
   * @param {variable} event 
   */
  stopPropagation: (event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  }
};