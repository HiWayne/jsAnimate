import { getClientHeight } from './util.js'
import { eventListener } from './util.js'


//类似wow.js和animate.css的效果，同时加入了类似vue-transition的自定义功能
export default function fade() {
  //所有需要懒加载的元素, 存放懒加载元素相关数据的数组, 窗口高度
  var lazyDocuments, lazyNodeArray = [], clientHeight
  lazyDocuments = document.getElementsByClassName("lazyfade")
  clientHeight = getClientHeight()
  for (var i = 0; i < lazyDocuments.length; i++) {
    var direction, reverse, zoom
    //因为考虑到ES6兼容性这里用var而不是let声明变量，所以它现在是fade函数内部的全局变量，每次循环用的都是同一个reverse，如果reverse希望为false必须命令式的让reverse = undefined，否则reverse会是上一次的赋值。或者用自执行函数也可以解决这个问题。
    if (lazyDocuments[i].classList.contains("zoomin")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform = "scale(0, 0)"
      lazyDocuments[i].style.webkitTransform = "scale(0, 0)"
      zoom = "zoomin"
      reverse = reverse ? reverse : undefined
    }
    if (lazyDocuments[i].classList.contains("zoomin-r")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform = "scale(0, 0)"
      lazyDocuments[i].style.webkitTransform = "scale(0, 0)"
      zoom = "zoomin-r"
      reverse = true
    }
    if (lazyDocuments[i].classList.contains("fadein-left")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform += " translate3d(-200px, 0, 0)"
      direction = "left"
      reverse = reverse ? reverse : undefined
    }
    if (lazyDocuments[i].classList.contains("fadein-right")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform += " translate3d(200px, 0, 0)"
      direction = "right"
      reverse = reverse ? reverse : undefined
    }
    if (lazyDocuments[i].classList.contains("fadein-top")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform += " translate3d(0, -200px, 0)"
      direction = "top"
      reverse = reverse ? reverse : undefined
    }
    if (lazyDocuments[i].classList.contains("fadein-bottom")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform += " translate3d(0, 200px, 0)"
      direction = "bottom"
      reverse = reverse ? reverse : undefined
    }
    if (lazyDocuments[i].classList.contains("fadein-left-r")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform += " translate3d(-200px, 0, 0)"
      direction = "left"
      reverse = true
    }
    if (lazyDocuments[i].classList.contains("fadein-right-r")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform += " translate3d(200px, 0, 0)"
      direction = "right"
      reverse = true
    }
    if (lazyDocuments[i].classList.contains("fadein-top-r")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform += " translate3d(0, -200px, 0)"
      direction = "top"
      reverse = true
    }
    if (lazyDocuments[i].classList.contains("fadein-bottom-r")) {
      lazyDocuments[i].style.opacity = 0
      lazyDocuments[i].style.transform += " translate3d(0, 200px, 0)"
      direction = "bottom"
      reverse = true
    }
    if (lazyDocuments[i].classList.contains("lazyfade-r")) {
      lazyDocuments[i].style.opacity = 0
      direction = "fade"
      reverse = true
    }
    var nodeData = {
      node: lazyDocuments[i],
      offsetTop: lazyDocuments[i].getBoundingClientRect().top,
      direction: direction,
      zoom: zoom,
      hasFadeIn: undefined,
      hasFadeOut: true,
      duration: {},
      reverse: reverse
    }
    //通过正则表达式将tag中的字符串属性转化成对象, 需要考虑用户可能会在键值对周围加上空格
    var durationValue
    if (durationValue = lazyDocuments[i].getAttribute('duration')) {
      var key, value
      var durationString = durationValue.trim()
      //首次匹配
      var reg1 = /^\{\s*(\w+)\s*:\s*(cubic-bezier\([^\)]+\)|[^\s][^,\}]*)/i
      //二次及以后匹配
      var reg2 = /^,\s*(\w+)\s*:\s*(cubic-bezier\([^\)]+\)|[^\s][^,\}]*)/i
      //第一次
      if (reg1.test(durationString)) {
        key = RegExp.$1
        value = RegExp.$2.trim()
        nodeData.duration[key] = value
        //匹配完的就可以删掉了
        durationString = durationString.replace(reg1, "")
      }
      //二次及更多次, 匹配失败说明已经获取全部键值对
      while (reg2.test(durationString)) {
        key = RegExp.$1
        value = RegExp.$2.trim()
        nodeData.duration[key] = value
        durationString = durationString.replace(reg2, "")
      }
    }
    var transitionValue
    if (transitionValue = lazyDocuments[i].getAttribute('transition-enter')) {
      nodeData.transitionEnter = transitionValue
      lazyDocuments[i].style.cssText += ";" + transitionValue
    }
    lazyNodeArray.push(nodeData)
    //除了自执行函数外, 每次循环之后清除fade内部全局变量也是一个方法
    reverse = undefined
    zoom = undefined
  }

  //lazyAnimation会返回一个真正被使用的懒加载动画方法
  var animateFade = lazyAnimation()

  eventListener(window, "scroll", animateFade)
  eventListener(window, "scroll", throttleMethod)
  //页面打开时初始过渡
  animateFade()

  //懒加载动画(将一些需要复杂计算的对象先初始化存放在内存中, 通过闭包的形式使用它们)
  function lazyAnimation() {
    //判断时间是否有单位, 进入过渡时间, 离开过渡时间
    var regTime = /^(\d+)$/i, enterDuration, leaveDuration
    //编译HTML模板, 预生成一系列保存了相关节点信息的nodeData对象, 为后续的遍历减轻压力
    lazyNodeArray.forEach(function (lazyNode) {
      //如果把transition样式写在在fade函数中会造成预期意外的过渡效果
      //默认是all 1s ease样式, 如果有用户自定义属性或者用原生style写的样式(如果自定义和原生style都存在, 以自定义为准), 那么以它们为准
      if (!lazyNode.node.style.transition && !lazyNode.duration.enter) {
        lazyNode.node.style.transition = "all 1s ease"
      }
      if (lazyNode.duration && (lazyNode.duration.enter || lazyNode.duration.bezier || lazyNode.duration.delay)) {
        if (lazyNode.duration.enter) {
          //全局正则多次匹配会共用同一个lastIndex，从上一次匹配结束的下标开始匹配，会导致匹配错误，因此改为局部正则
          if (regTime.test(lazyNode.duration.enter)) {
            enterDuration = lazyNode.duration.enter + "ms"
          }
          else {
            enterDuration = lazyNode.duration.enter
          }
          lazyNode.node.style.transition = "all " + enterDuration + " ease"
        }
        if (lazyNode.duration.bezier) {
          lazyNode.node.style.transitionTimingFunction = lazyNode.duration.bezier
        }
        if (lazyNode.duration.delay) {
          //不写单位默认是ms
          var delayString = lazyNode.duration.delay
          delayString = delayString.trim()
          if (regTime.test(delayString)) {
            lazyNode.node.style.transitionDelay = RegExp.$1 + "ms"
          }
          else {
            lazyNode.node.style.transitionDelay = delayString
          }
        }
      }
    })
    function run() {
      lazyNodeArray.forEach(function (lazyNode) {
        if (lazyNode.hasFadeIn) return
        //更新元素据窗口顶部距离
        lazyNode.offsetTop = lazyNode.node.getBoundingClientRect().top
        if (!lazyNode.reverse) {
          if (lazyNode.offsetTop <= clientHeight && lazyNode.offsetTop >= 0) {
            lazyNode.hasFadeIn = true
            enterTo(lazyNode)
            return
          }
        }
        //元素离开窗口时动画反转
        else {
          if (lazyNode.offsetTop <= clientHeight / 10 * 9 && lazyNode.offsetTop >= clientHeight / 8) {
            //已经是进入状态时, 以后不会再次重复触发, 这个过程期间一切行为都被冻结, 直到进入状态时间结束并且经历过一次离开状态才能重新触发进入状态
            if (!lazyNode.hasFadeOut) return
            lazyNode.hasFadeIn = true
            lazyNode.hasFadeOut = false
            var allTime = compelateTime(lazyNode)
            enterTo(lazyNode)
            setTimeout(function () {
              lazyNode.hasFadeIn = false
            }, allTime)
          }
          else if (lazyNode.offsetTop < clientHeight / 8 || lazyNode.offsetTop > clientHeight / 10 * 9) {
            //已经进入离开状态时, 以后不会再次重复触发, 直到经历过一次进入状态才能重新触发离开状态
            if (lazyNode.hasFadeOut) return
            lazyNode.hasFadeOut = true
            if (lazyNode.duration && lazyNode.duration.leave) {
              //时间不写单位默认是ms
              lazyNode.duration.leave = lazyNode.duration.leave.trim()
              if (regTime.test(lazyNode.duration.leave)) {
                leaveDuration = lazyNode.duration.leave + "ms"
              }
              else {
                leaveDuration = lazyNode.duration.leave
              }
              lazyNode.node.style.transitionDuration = leaveDuration
            }
            leaveTo(lazyNode, lazyNode.direction, lazyNode.zoom)
          }
        }
      })
    }

    //enter-to
    function enterTo(lazyNode) {
      var delay = 0
      var targetIndex
      if (lazyNode.delay) {
        delay = lazyNode.delay
      }
      if (!lazyNode.delay && lazyNode.duration && lazyNode.duration.follow) {
        var follow = lazyNode.duration.follow
        var reg = /^follow(.*)$/i, postfix = ""
        if (reg.test(follow)) {
          postfix = RegExp.$1
        }
        else {
          throw new Error("the attribute of element should be follow + ...")
        }
        lazyNodeArray.forEach(function (object, index) {
          if (object.duration.target && object.duration.target === 'target' + postfix) {
            if (targetIndex) {
              throw new Error("redeclaration of target")
            }
            targetIndex = index
            if (object.delay) {
              delay = parseFloat(object.delay) + (parseFloat(object.duration.enter) || 1000)
            }
            else {
              delay = compelateTime(object)
              //如果有动画，算上动画时间
              if (lazyNode.duration.animation) {
                var animationTime = (parseFloat(getComputedStyle(lazyNode.node, null).getPropertyValue('animation-duration')) || 0) + (parseFloat(getComputedStyle(lazyNode.node, null).getPropertyValue('animation-delay')) || 0)
                delay = parseFloat(delay) + animationTime
              }
            }
            lazyNode.delay = delay
            return
          }
        })
        if (delay) {
          lazyNode.node.style.transitionDelay = delay + "ms"
        }
      }
      if (lazyNode.duration && lazyNode.duration.animation) {
        var newParent
        //已经创建过父元素的不会再创建了
        if (!lazyNode.node.parentNode.getAttribute('sign')) {
          //transform和animation不能共存，在该节点的外层再创建一个父节点用来使用transform
          var formalParent = lazyNode.node.parentNode
          newParent = document.createElement('div')
          newParent.setAttribute('sign', true)
          newParent.style.display = 'inline-block'
          newParent.style.opacity = lazyNode.node.style.opacity
          newParent.style.transform = lazyNode.node.style.transform
          newParent.style.transition = lazyNode.node.style.transition
          if (delay) {
            newParent.style.transitionDelay = delay + "ms"
          }
          lazyNode.node.style.opacity = ""
          lazyNode.node.style.transform = ""
          lazyNode.node.style.transition = ""
          lazyNode.node.style.transitionDelay = ""
          formalParent.insertBefore(newParent, lazyNode.node)
          newParent.appendChild(lazyNode.node)
        }
        else {
          newParent = lazyNode.node.parentNode
        }
        var animation = lazyNode.duration.animation
        //把"abc def"格式的字符串转成"abc","def"格式的数组
        var animationName = animation.split(" ")
        classListRemove(lazyNode.node, animationName)
        if (lazyNode.duration.type) {
          var type = lazyNode.duration.type
          switch (type) {
            case "transition":
              //样式改变不会立刻渲染在页面上，渲染机制是当下方不再有样式改变了再统一去渲染以节省性能，，所以这里强制重绘，再改变样式
              var rf = lazyNode.node.offsetHeight
              newParent.style.opacity = 1
              newParent.style.transform = "scale(1, 1) translate3d(0, 0, 0)"
              newParent.style.webkitTransform = "scale(1, 1) translate3d(0, 0, 0)"
              setTimeout(function () {
                lazyNode.node.className += " " + animation
              }, delay || compelateTime(lazyNode))
              break
            case "animation":
              newParent.style.opacity = 1
              //样式改变不会立刻渲染在页面上，渲染机制是当下方不再有样式改变了再统一去渲染以节省性能，，所以这里强制重绘，再改变样式
              var rf = lazyNode.node.offsetHeight
              lazyNode.node.className += " " + animation
              setTimeout(function () {
                newParent.style.transform = "scale(1, 1) translate3d(0, 0, 0)"
                newParent.style.webkitTransform = "scale(1, 1) translate3d(0, 0, 0)"
                classListRemove(lazyNode.node, animationName)
              }, delay || compelateTime(lazyNode))
              break
          }
          return
        }
        else {
          //样式改变不会立刻渲染在页面上，渲染机制是当下方不再有样式改变了再统一去渲染以节省性能，，所以这里强制重绘，再改变样式
          var rf = lazyNode.node.offsetHeight
          newParent.style.opacity = 1
          newParent.style.transform = "scale(1, 1) translate3d(0, 0, 0)"
          newParent.style.webkitTransform = "scale(1, 1) translate3d(0, 0, 0)"
          lazyNode.node.className += " " + animation
          return
        }
      }
      //样式改变不会立刻渲染在页面上，渲染机制是当下方不再有样式改变了再统一去渲染以节省性能，，所以这里强制重绘，再改变样式
      var rf = lazyNode.node.offsetHeight
      lazyNode.node.style.transform = "scale(1, 1) translate3d(0, 0, 0)"
      lazyNode.node.style.webkitTransform = "scale(1, 1) translate3d(0, 0, 0)"
      lazyNode.node.style.opacity = 1
    }

    //leave-to
    function leaveTo(lazyNode, direction, zoom) {
      var delay
      if (lazyNode.delay) {
        lazyNode.node.style.transitionDelay = delay + "ms"
      }
      var translate3d = "", scale = ""
      switch (direction) {
        case "left":
          translate3d = " translate3d(-200px, 0, 0)"
          break
        case "right":
          translate3d = " translate3d(200px, 0, 0)"
          break
        case "top":
          translate3d = " translate3d(0, -200px, 0)"
          break
        case "bottom":
          translate3d = " translate3d(0, 200px, 0)"
          break
      }
      if (zoom) {
        switch (zoom) {
          case "zoomin-r":
            scale = "scale(0, 0)"
            break
        }
      }
      //如果有动画属性
      if (lazyNode.duration && lazyNode.duration.animation) {
        var animation = lazyNode.duration.animation
        //把"abc def"格式的字符串转成"abc","def"格式的数组
        var animationName = animation.split(" ")
        var newParent = lazyNode.node.parentNode
        if (delay) {
          newParent.style.transitionDelay = delay + 'ms'
        }
        //如果定义了过渡与动画的先后顺序
        if (lazyNode.duration.type) {
          var type = lazyNode.duration.type
          switch (type) {
            case "transition":
              classListRemove(lazyNode.node, animationName)
              //样式改变不会立刻渲染在页面上，渲染机制是当下方不再有样式改变了再统一去渲染以节省性能，，所以这里强制重绘，再改变样式
              var rf = lazyNode.node.offsetHeight
              lazyNode.node.className += " " + animation
              setTimeout(function () {
                newParent.style.transform = scale + translate3d
                newParent.style.opacity = 0
              }, delay || compelateTime(lazyNode))
              break
            case "animation":
              newParent.style.transform = scale + translate3d
              setTimeout(function () {
                lazyNode.node.className += " " + animation
                newParent.style.opacity = 0
              }, delay || compelateTime(lazyNode))
              break
          }
        }
        else {
          classListRemove(lazyNode.node, animationName)
          newParent.style.opacity = 0
          newParent.style.transform = scale + translate3d
          //样式改变不会立刻渲染在页面上，渲染机制是当下方不再有样式改变了再统一去渲染以节省性能，，所以这里强制重绘，再改变样式
          var rf = lazyNode.node.offsetHeight
          lazyNode.node.className += " " + animation
          return
        }
      }
      else {
        lazyNode.node.style.transform = scale + translate3d
        lazyNode.node.style.opacity = 0
      }
    }

    function classListRemove(node, animationNameArray) {
      animationNameArray.forEach(function (className) {
        node.classList.remove(className)
      })
    }

    //过渡总时间
    function compelateTime(lazyNode) {
      //时间死区的时间allTime = 过渡时间enterTime + 延迟时间delayTime, 时间不写单位默认是ms
      var enterTime, delayTime, allTime
      if (lazyNode.duration && lazyNode.duration.enter && regTime.test(lazyNode.duration.enter)) {
        enterTime = parseFloat(lazyNode.duration.enter)
      }
      else if (lazyNode.duration && lazyNode.duration.enter) {
        if (/^\d+\.?\d*\w$/g.test(lazyNode.duration.enter)) {
          enterTime = parseFloat(lazyNode.duration.enter) * 1000
        }
        else {
          enterTime = parseFloat(lazyNode.duration.enter)
        }
      }
      if (lazyNode.duration && lazyNode.duration.delay && regTime.test(lazyNode.duration.delay)) {
        delayTime = parseFloat(lazyNode.duration.delay)
      }
      else if (lazyNode.duration && lazyNode.duration.delay) {
        if (/^\d+\.?\d*\w$/g.test(lazyNode.duration.delay)) {
          delayTime = parseFloat(lazyNode.duration.delay) * 1000
        }
        else {
          delayTime = parseFloat(lazyNode.duration.delay)
        }
      }
      allTime = (enterTime || 1000) + (delayTime || 0)
      return allTime
    }

    return run
  }

  //scroll事件函数节流
  function throttleMethod() {
    window.removeEventListener("scroll", animateFade)
    window.removeEventListener("scroll", throttleMethod)
    setTimeout(function () {
      eventListener(window, "scroll", animateFade)
      eventListener(window, "scroll", throttleMethod)
    }, 20)
  }
}