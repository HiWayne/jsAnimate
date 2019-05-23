import { caculateWidth } from './util'
import { eventListener } from './util'
import { objectInterface } from './util'

//旋转木马方法
export default function slick(object) {
  //接口检查, object必须有id属性, 且值的类型是字符串
  objectInterface(object, {
    id: "String"
  })
  var node, slideTime, number, height, quick, row, imgScale, autoSlide, tempSlideTimeout, intervalTime
  node = document.getElementById(object.id)
  slideTime = object.speed || 0.3
  quick = object.quick
  row = object.row
  imgScale = object.imgScale
  autoSlide = object.autoSlide
  intervalTime = object.intervalTime || 2000
  //若不传参的默认参数
  number = object.number || 5
  height = object.height || 120
  //长宽比例系数, 刷新率, 限制点击频率, 临时储存定时器, ul长度, 当前滚动张数
  var scale, refresh = 10, debounce, tempMoveTimeout, ulWidth, currentIndex = 0
  //添加node样式
  node.style.cssText = "position:relative;margin:0;padding:0 45px;overflow:hidden;height:" + height + "px;"
  //创建文档片段
  var fragment = document.createDocumentFragment()
  //创建滚动div
  var divWrap = document.createElement("div")
  //添加divWrap样式
  divWrap.style.overflow = "hidden"
  divWrap.style.width = "100%"
  divWrap.style.height = "100%"
  divWrap.style.whiteSpace = "noWrap"
  //创建ul
  var ul = document.createElement("ul")
  //渲染前根元素div中的所有子元素
  var childrenList = node.children
  var length = childrenList.length
  for (var i = 0; i < length; i++) {
    var li = document.createElement("li")
    li.appendChild(childrenList[0])
    ul.appendChild(li)
  }
  //添加ul样式
  ul.style.cssText = "margin:0;padding:0;display:inline-block;white-space:nowrap;height:100%;list-style:none;"
  //如果展示的内容不足期望的数量,居中并没有移动效果
  if (length <= number) {
    ul.style.display = "flex"
    ul.style.flexFlow = "row nowrap"
    ul.style.justifyContent = "center"
    ul.style.alignItems = "center"
  }
  else {
    //把ul前后复制一份
    var firstUl = ul.cloneNode(true)
    var lastUl = ul.cloneNode(true)
    divWrap.appendChild(firstUl)
    divWrap.appendChild(ul)
    divWrap.appendChild(lastUl)
  }
  divWrap.appendChild(ul)
  //创建左右按钮
  var leftButton = document.createElement("span")
  var rightButton = document.createElement("span")
  leftButton.style.cssText = "position:absolute;left:5px;top:50%;margin-top:-15px;width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#eeeeee;transition:all 0.8s ease-out;cursor:pointer;color:rgb(70, 70, 70);"
  rightButton.style.cssText = "position:absolute;right:5px;top:50%;margin-top:-15px;width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#eeeeee;transition:all 0.8s ease-out;cursor:pointer;color:rgb(70, 70, 70);"
  //需要在Y轴拉伸 < 和 >
  var leftButton_span = document.createElement("span")
  leftButton_span.innerHTML = "<"
  leftButton_span.style.cssText = "display: inline-block;width: 100%;height: 100%;transform: scaleY(1.7);"
  var rightButton_span = document.createElement("span")
  rightButton_span.innerHTML = ">"
  rightButton_span.style.cssText = "display: inline-block;width: 100%;height: 100%;transform: scaleY(1.7);"
  leftButton.appendChild(leftButton_span)
  rightButton.appendChild(rightButton_span)
  //绑定按钮鼠标移入移出事件
  eventListener(leftButton, "mouseover", function () {
    this.style.color = "white"
    this.style.backgroundColor = "#3057d8"
    this.style.boxShadow = "0 0 4px 4px #bcc5f3"
  })
  eventListener(leftButton, "mouseleave", function () {
    this.style.color = "rgb(70, 70, 70)"
    this.style.backgroundColor = "#eeeeee"
    this.style.boxShadow = ""
  })
  eventListener(rightButton, "mouseover", function () {
    this.style.color = "white"
    this.style.backgroundColor = "#3057d8"
    this.style.boxShadow = "0 0 4px 4px #bcc5f3"
  })
  eventListener(rightButton, "mouseleave", function () {
    this.style.color = "rgb(70, 70, 70)"
    this.style.backgroundColor = "#eeeeee"
    this.style.boxShadow = ""
  })
  //绑定按钮点击事件
  eventListener(leftButton, "click", function () {
    if (length > number) slide("left")
  })
  eventListener(rightButton, "click", function () {
    if (length > number) slide("right")
  })
  fragment.appendChild(divWrap)
  fragment.appendChild(leftButton)
  fragment.appendChild(rightButton)
  node.appendChild(fragment)
  eventListener(window, "resize", function () {
    plateWidth = caculateWidth(divWrap)
    renderSize(plateWidth)
  })
  //计算divWrap实际宽度, 视图中一块平均宽度(减去外边距)
  var plateWidth, itemWidth
  plateWidth = caculateWidth(divWrap)
  itemWidth = plateWidth / number - 20
  //储存第一次的长宽比例
  scale = itemWidth / height
  //初始渲染元素尺寸
  renderSize(plateWidth)
  //如果有自动轮播效果, 执行轮播事件, 注册根元素hover暂停事件
  if (autoSlide) {
    imageSlide()
    eventListener(node, "mouseover", function () {
      clearInterval(tempSlideTimeout)
    })
    eventListener(node, "mouseleave", function () {
      imageSlide()
    })
  }

  //根据屏幕变化重新渲染相关元素的尺寸
  function renderSize(plateWidth) {
    itemWidth = plateWidth / number - 20
    height = itemWidth / scale
    node.style.height = height + "px"
    for (var k = 0; k < divWrap.children.length; k++) {
      //ul
      var itemUl = divWrap.children
      for (var l = 0; l < itemUl[k].children.length; l++) {
        //li
        itemUl[k].children[l].style.cssText = "display:inline-block;margin:0 10px;vertical-align:top;width:" + itemWidth + "px;height:100%;text-align:center;background:#eeeeee;box-sizing:border-box;cursor:pointer;overflow:hidden;"
        var formerRoot = itemUl[k].children[l].firstChild
        formerRoot.style.display = "flex"
        if (row && row !== "column") {
          formerRoot.style.flexFlow = "row nowrap"
        }
        else {
          formerRoot.style.flexFlow = "column nowrap"
        }
        formerRoot.style.justifyContent = "space-between"
        formerRoot.style.alignItems = "center"
        formerRoot.style.height = "100%"
        for (var m = 0; m < formerRoot.children.length; m++) {
          //图片缩放效果
          if (imgScale) {
            if (formerRoot.children[m].nodeName === "IMG") {
              eventListener(formerRoot.children[m], "mouseover", function (e) {
                e = e || window.event
                var target = e.target
                target.style.transform = "scale(1.2, 1.2)"
              })
              eventListener(formerRoot.children[m], "mouseleave", function (e) {
                e = e || window.event
                var target = e.target
                target.style.transform = "scale(1, 1)"
              })
            }
          }
          formerRoot.children[m].style.transition = "all 0.4s ease-out"
          formerRoot.children[m].style.maxWidth = "100%"
          formerRoot.children[m].style.flex = "0 1 auto"
        }
      }
    }
    //获取ul宽度
    ulWidth = caculateWidth(ul)
    //初始滚动位置
    if (length > number) divWrap.scrollLeft = ulWidth + plateWidth / number * currentIndex
  }

  function imageSlide() {
    tempSlideTimeout = setInterval(function () {
      if (length > number) slide("right")
    }, intervalTime)
  }

  //点击向左向右移动方法
  function slide(direction) {
    if (debounce) return
    debounce = true
    switch (direction) {
      case "left":
        left()
        break
      case "right":
        right()
        break
    }
  }

  //向左滚动
  function left() {
    var index = -1
    if (quick) {
      currentIndex -= number
      index = index * number
    }
    else {
      currentIndex--
    }
    graduallymove(index)
  }

  //向右滚动
  function right() {
    var index = 1
    if (quick) {
      currentIndex += number
      index = index * number
    }
    else {
      currentIndex++
    }
    graduallymove(index)
  }

  //滚动方法
  function graduallymove(index) {
    clearTimeout(tempMoveTimeout)
    //更新底部小圆点颜色
    //todo
    var currentScrollLeft = divWrap.scrollLeft
    var targetScrollLeft = currentScrollLeft + plateWidth / number * index
    //限制targetScrollLeft范围, 否则定时器可能到不了终止条件, 考虑到误差情况取1
    targetScrollLeft = targetScrollLeft < 1 ? 0 : targetScrollLeft

    //如果是quick模式, 需要另一种计算方法
    if (quick) {
      //如果划过的图片大于单个ul总宽度, 滚动位置减ulWidth, 看上去页面没有变化, 其实回到了安全位置
      /*另一种计算方法由于是索引是一个一个增加的, 不适用一次增加多个的情况, 
        滚动条走到尽头之后, currentScrollLeft小于targetScrollLeft, 减ulWidth也是和期望的页面不一样的
      */
      if (currentIndex >= length) {
        currentIndex -= length
        currentScrollLeft = divWrap.scrollLeft -= ulWidth
      }
      //相反的情况同理
      else if (currentIndex <= -length) {
        currentIndex += length
        currentScrollLeft = divWrap.scrollLeft += ulWidth
      }
      targetScrollLeft = ulWidth + plateWidth / number * currentIndex
    }

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
          //如果小于滚动限制, divWrap依然保持上一次滚动位置, 从而陷入死循环
          if (divWrap.scrollLeft + step < 0) step = 0 - divWrap.scrollLeft
          gradually(step, right)
        }
        else if (right && divWrap.scrollLeft < targetScrollLeft) {
          if (divWrap.scrollLeft + step > ulWidth * 2) step = ulWidth * 2 - divWrap.scrollLeft
          gradually(step, right)
        }
        else {
          divWrap.scrollLeft = targetScrollLeft
          divWrap.scrollLeft = targetScrollLeft

          //这里是没有quick的计算方法
          //js数字位数有限，元素越多误差越大，所以只能用计数来判断ul有没有走尽
          if (!quick && Math.abs(currentIndex) === length) {
            divWrap.scrollLeft = ulWidth
            currentIndex = 0
          }
          debounce = undefined
          return
        }
      }, refresh)
    }
  }
  return node
}