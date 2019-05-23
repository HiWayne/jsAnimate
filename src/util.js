//计算真实宽度，不算进border等
export function caculateWidth(node) {
  var width
  if (getComputedStyle) {
    width = parseFloat(getComputedStyle(node, null).width)
  }
  else {
    width = parseFloat(node.currentStyle.width)
  }
  return width
}

//兼容IE事件监听
export function eventListener(node, eventName, fn, useCapture) {
  if (window.addEventListener) {
    node.addEventListener(eventName, fn, useCapture)
  }
  else {
    node.attachEvent('on' + eventName, fn)
  }
}

//返回窗口高度
export function getClientHeight() {
  var clientHeight = 0;
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  }
  else {
    var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  }
  return clientHeight;
}

//对象接口
export function objectInterface(object, type) {
  if (Object.prototype.toString.call(object) === "[object Object]" && Object.prototype.toString.call(type) === "[object Object]") {
    //用来存放所有类型错误的字符串集合
    var error = ""
    //循环type中的字段
    Object.keys(type).forEach(function (key) {
      //type中每个字段对应的值, 即字段的值期望的类型
      var value = type[key]
      //如果object中相应的字段值不是期望的类型, error中添加property-type格式的报错
      if (Object.prototype.toString.call(object[key]) !== "[object " + value + "]") {
        error += key + "-" + value + " "
      }
    })
    if (error) {
      throw new TypeError("the param of slide don't have correct-type-property: " + error)
    }
    else {
      return true
    }
  }
  else {
    throw new TypeError("the param of objectInterface is not object")
  }
}