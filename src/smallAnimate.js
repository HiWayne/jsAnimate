//临时储存定时器对象
var tempShowHideSetTime, tempReturnTopSetTime

//从display:none到display:block并逐渐显示元素, 参数: 元素节点id, 渐变时间s
export function show(id, time) {
  if (typeof (id) !== "string") {
    throw new TypeError("the id of hide is not string")
  }
  if (typeof (time) !== "number") {
    throw new TypeError("the time of hide is not number")
  }
  node = document.getElementById(id)
  //避免不必要的性能消耗, 需要注意opacity是字符串
  if (node.style.opacity === "1") return
  //先清除之前的定时器, 如果有的话, 防止显示和消失同时进行
  clearTimeout(tempShowHideSetTime)
  //闭包
  //node.style.opacity || 0 是为了让渐变在当前的透明度开始,而不是例如: 突然从0.5变成0再慢慢变成1; 刷新率; 每次刷新改变的透明度
  var opacity = node.style.opacity || 0, refresh = 10, step = 1 / (time * 1000 / refresh)
  //需要将字符串转换成浮点数
  opacity = parseFloat(opacity)
  node.style.display = "block"
  gradually()
  function gradually() {
    node.style.opacity = opacity
    opacity += step
    if (opacity < 1) {
      tempShowHideSetTime = setTimeout(function () {
        gradually()
      }, refresh)
    }
    else if (opacity >= 1) {
      setTimeout(function () {
        node.style.opacity = 1
      }, refresh)
      return
    }
  }
}

//逐渐消失元素并在最后display:none,  参数: 元素节点id, 渐变时间s
export function hide(id, time) {
  if (typeof (id) !== "string") {
    throw new TypeError("the id of hide is not string")
  }
  if (typeof (time) !== "number") {
    throw new TypeError("the time of hide is not number")
  }
  node = document.getElementById(id)
  //避免不必要的性能消耗, 需要注意opacity是字符串
  if (node.style.opacity === "0") return
  //先清除之前的定时器, 如果有的话, 防止显示和消失同时进行
  clearTimeout(tempShowHideSetTime)
  //闭包
  //node.style.opacity || 1 是为了让渐变在当前的透明度开始,而不是例如: 突然从0.5变成1再慢慢变成0; 刷新率; 每次刷新改变的透明度
  var opacity = node.style.opacity || 1, refresh = 10, step = 1 / (time * 1000 / refresh)
  //需要将字符串转换成浮点数
  opacity = parseFloat(opacity)
  gradually()
  function gradually() {
    node.style.opacity = opacity
    opacity -= step
    if (opacity > 0) {
      tempShowHideSetTime = setTimeout(function () {
        gradually()
      }, refresh)
    }
    else if (opacity <= 0) {
      setTimeout(function () {
        node.style.opacity = 0
        node.style.display = "none"
      }, refresh)
      return
    }
  }
}

//从当前位置滚动到页面顶部, 参数: 滚动时间s
export function returnTop(time) {
  if (typeof (time) !== "number") {
    throw new Error("the param of returnTop is not number")
  }
  clearTimeout(tempReturnTopSetTime)
  //获取顶部卷去长度, 分别兼容FF、Chrome, Safari, IE
  var scrollDistance = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0
  if (scrollDistance > 0) {
    //刷新时间ms, 每次刷新移动距离(step不能写在gradually函数里, 一来没必要每次都算一遍, 二来scrollDistance每次都会改变, 这样算出来的值无限趋向于0)
    var refresh = 10, step = scrollDistance / (time * 1000 / refresh)
    if (document.documentElement.scrollTop) {
      gradually(document.documentElement, "scrollTop")
    }
    else if (window.pageYOffset) {
      gradually(window, "pageYOffset")
    }
    else if (document.body.scrollTop) {
      gradually(document.body, "scrollTop")
    }
  }
  function gradually(nodeObject, property) {
    nodeObject[property] = scrollDistance
    scrollDistance -= step
    if (scrollDistance > 0) {
      tempReturnTopSetTime = setTimeout(function () {
        gradually(nodeObject, property)
      }, refresh)
    }
    else if (scrollDistance <= 0) {
      setTimeout(function () {
        nodeObject[property] = 0
      }, refresh)
      return
    }
  }
}