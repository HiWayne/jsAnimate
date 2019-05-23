import { caculateWidth } from './util'
import { eventListener } from './util'
import { objectInterface } from './util'

//轮播图, 参数: 元素节点, 滚动时间s
export default function slide(object) {
  //接口检查, object必须有id属性, 且值的类型是字符串
  objectInterface(object, {
    id: "String"
  })
  //节点, 轮播时间, 切换速度
  var node, intervalTime, slideTime, noArrow, noBottom, noAutoSlide
  node = document.getElementById(object.id)
  intervalTime = object.time || 3
  slideTime = object.speed || 0.3
  noArrow = object.noArrow
  noBottom = object.noBottom
  noAutoSlide = object.noAutoSlide
  node.style.width = "100%"
  node.style.position = "relative"
  node.style.overflow = "hidden"
  var imgList = node.children
  var imgNumber = imgList.length
  if (imgNumber === 1 || 0) {
    return
  }
  //插入文档片段的子元素, 当前索引, 图片宽度, 刷新率, 临时储存定时器, 限制点击频率
  var imgChild, currentIndex = 1, imgWidth, refresh = 10, tempMoveTimeout, tempSlideTimeout, debounce
  //创建文档片段
  var fragment = document.createDocumentFragment()
  var divWrap = document.createElement("div")
  divWrap.style.cssText = "white-space:nowrap;overflow:hidden;"
  fragment.appendChild(divWrap)
  //复制最后一张图片插入第一张, 复制第一张图片插入最后一张
  var cloneLastImg = imgList[imgNumber - 1].cloneNode(true)
  cloneLastImg.style.display = "inline-block"
  cloneLastImg.style.width = "100%"
  var cloneFirstImg = imgList[0].cloneNode(true)
  cloneFirstImg.style.display = "inline-block"
  cloneFirstImg.style.width = "100%"
  //复制最后一张图片插入第一张
  divWrap.appendChild(cloneLastImg)
  //插入原来的图片
  while (imgChild = imgList[0]) {
    divWrap.appendChild(imgChild)
    imgChild.style.display = "inline-block"
    imgChild.style.width = "100%"
  }
  //复制第一张图片插入最后一张
  divWrap.appendChild(cloneFirstImg)
  if (!noBottom) {
    //底部小圆点父元素
    var smallPotDiv = document.createElement("div")
    smallPotDiv.style.cssText = "position:absolute;left:0;bottom:30px;width:100%;height:8px;text-align:center;"
    //插入底部圆点
    for (var j = 0; j < imgNumber; j++) {
      var smallPot = document.createElement("span")
      smallPot.style.cssText = "display:inline-block;margin:0 12px;width:50px;height:100%;border-radius:20px;background:#fff;opacity:0.7;cursor:pointer;"
      smallPotDiv.appendChild(smallPot)
    }
    //底部小圆点父元素绑定轮播函数
    eventListener(smallPotDiv, "click", bottomClickEvent)
    divWrap.appendChild(smallPotDiv)
  }
  if (!noArrow) {
    //左右箭头
    var leftArrow = document.createElement("span")
    var rightArrow = document.createElement("span")
    leftArrow.style.cssText = "position:absolute;left:30px;top:50%;margin-top:-35px;width:60px;height:70px;line-height:70px;text-align:center;background:transparent;opacity:0;font-size:50px;color:#eee;transform:scaleY(2);cursor:pointer;transition:all 0.3s ease;"
    rightArrow.style.cssText = "position:absolute;right:30px;top:50%;margin-top:-35px;width:60px;height:70px;line-height:70px;text-align:center;background:transparent;opacity:0;font-size:50px;color:#eee;transform:scaleY(2);cursor:pointer;transition:all 0.3s ease;"
    leftArrow.innerHTML = "<"
    rightArrow.innerHTML = ">"
    arrowPositionSize(leftArrow, rightArrow)
    //最外层元素鼠标移入移出时改变箭头元素透明度
    eventListener(node, "mouseover", function () {
      leftArrow.style.opacity = 1
      rightArrow.style.opacity = 1
    })
    eventListener(node, "mouseleave", function () {
      leftArrow.style.opacity = 0
      rightArrow.style.opacity = 0
    })
    //左右箭头元素鼠标移入移出时改变背景
    eventListener(leftArrow, "mouseover", function () {
      leftArrow.style.backgroundColor = "rgba(180, 180, 180, 0.1)"
    })
    eventListener(leftArrow, "mouseleave", function () {
      leftArrow.style.backgroundColor = "transparent"
    })
    eventListener(rightArrow, "mouseover", function () {
      rightArrow.style.backgroundColor = "rgba(180, 180, 180, 0.1)"
    })
    eventListener(rightArrow, "mouseleave", function () {
      rightArrow.style.backgroundColor = "transparent"
    })
    //左右箭头添加点击事件
    eventListener(leftArrow, "click", function (e) {
      e = e || window.event
      imageSlide("left")
    })
    eventListener(rightArrow, "click", function (e) {
      e = e || window.event
      imageSlide("right")
    })
    //向父元素插入左右箭头元素
    divWrap.appendChild(leftArrow)
    divWrap.appendChild(rightArrow)
  }
  //最外层元素鼠标移入时暂停自动轮播
  eventListener(node, "mouseover", function () {
    clearInterval(tempSlideTimeout)
  })
  eventListener(node, "mouseleave", function () {
    tempSlideTimeout = imgAutoSlide()
  })
  //向根元素插入文档片段
  node.appendChild(fragment)
  //显示初始圆点颜色
  showColor(currentIndex)
  //直接在渲染节点的函数里计算宽度是1920, 因为节点还未完全渲染, 实际是1903, 所以延迟计算
  eventListener(window, "load", scrollDistance)
  function scrollDistance() {
    imgWidth = caculateWidth(node)
    //刷新页面后滚动距离回归实际第一张图片位置
    divWrap.scrollLeft = imgWidth
  }
  //在窗口变化时自动更新width和箭头位置大小
  eventListener(window, "resize", function () {
    imgWidth = caculateWidth(node)
    divWrap.scrollLeft = imgWidth * currentIndex
    arrowPositionSize(leftArrow, rightArrow)
  })
  //图片自动轮播方法
  imgAutoSlide()

  //图片自动轮播方法
  function imgAutoSlide() {
    if (noAutoSlide) return
    tempSlideTimeout = setInterval(function () {
      right()
    }, intervalTime * 1000)
    return tempSlideTimeout
  }

  //箭头位置大小
  function arrowPositionSize(leftArrow, rightArrow) {
    if (noArrow) return
    //箭头的大小位置是相对的
    var wrapperWidth = caculateWidth(node)
    //箭头位置, 箭头宽度, 箭头高度, 外边距, 字体大小
    var arrowLeftRight, arrowWidth, arrowHeight, marginTop, fontSize
    arrowLeftRight = 30 / 1903 * wrapperWidth
    arrowWidth = 60 / 1903 * wrapperWidth
    arrowHeight = 70 / 1903 * wrapperWidth
    fontSize = 50 / 1903 * wrapperWidth
    leftArrow.style.left = arrowLeftRight + "px"
    leftArrow.style.marginTop = -arrowHeight / 2 + "px"
    leftArrow.style.width = arrowWidth + "px"
    leftArrow.style.height = arrowHeight + "px"
    leftArrow.style.lineHeight = arrowHeight + "px"
    leftArrow.style.fontSize = fontSize + "px"
    rightArrow.style.right = arrowLeftRight + "px"
    rightArrow.style.marginTop = -arrowHeight / 2 + "px"
    rightArrow.style.width = arrowWidth + "px"
    rightArrow.style.height = arrowHeight + "px"
    rightArrow.style.lineHeight = arrowHeight + "px"
    rightArrow.style.fontSize = fontSize + "px"
  }

  //图片点击向左向右移动方法
  function imageSlide(direction) {
    if (debounce) return
    debounce = true
    switch (direction) {
      case "left":
        left()
        break
      case "right":
        right()
        break
      default:
        right()
        break
    }
  }

  //点击底部轮播方法
  function bottomClickEvent(e) {
    if (debounce) return
    e = e || window.event
    var target = e.target
    if (target.nodeName !== "SPAN") return
    if (getComputedStyle) {
      imgWidth = parseFloat(getComputedStyle(node, null).width)
    }
    else {
      imgWidth = parseFloat(node.currentStyle.width)
    }
    var index
    var targetParent = target.parentNode
    var targetArray = targetParent.children
    for (var i = 0; i < targetArray.length; i++) {
      if (targetArray[i] === target) {
        index = i
        break
      }
    }
    index++
    if (currentIndex === index) return
    graduallymove(index)
    currentIndex = index
  }

  //看左边图片
  function left() {
    currentIndex--
    graduallymove(currentIndex)
  }

  //看右边图片
  function right() {
    currentIndex++
    graduallymove(currentIndex)
  }

  //图片移动方法
  function graduallymove(index) {
    clearTimeout(tempMoveTimeout)
    if (index === imgNumber + 1) {
      currentIndex = 1
    }
    else if (index === 0) {
      currentIndex = imgNumber
    }
    //更新底部小圆点颜色
    showColor(index)
    var targetScrollLeft = imgWidth * index
    var currentScrollLeft = divWrap.scrollLeft
    var distance = Math.abs(targetScrollLeft - currentScrollLeft)
    var step = distance / (slideTime * 1000 / refresh)
    if (targetScrollLeft < currentScrollLeft) {
      gradually(-step)
    }
    else if (targetScrollLeft > currentScrollLeft) {
      gradually(step, true)
    }
    function gradually(step, right) {
      tempMoveTimeout = setTimeout(function () {
        divWrap.scrollLeft += step
        if (!right && divWrap.scrollLeft > targetScrollLeft) {
          gradually(step, right)
        }
        else if (right && divWrap.scrollLeft < targetScrollLeft) {
          gradually(step, right)
        }
        else {
          divWrap.scrollLeft = targetScrollLeft
          divWrap.scrollLeft = imgWidth * currentIndex
          debounce = undefined
          return
        }
      }, refresh)
    }
  }

  //底部小圆点改变颜色方法
  function showColor(index) {
    if (noBottom) return
    index--
    index = index > imgNumber - 1 ? 0 : index
    index = index < 0 ? imgNumber - 1 : index
    for (var i = 0; i < smallPotDiv.children.length; i++) {
      if (index === i) {
        smallPotDiv.children[i].style.backgroundColor = "#25b8fd"
        smallPotDiv.children[i].style.opacity = 1
      }
      else {
        smallPotDiv.children[i].style.backgroundColor = "#fff"
        smallPotDiv.children[i].style.opacity = 0.7
      }
    }
  }
  return node
}