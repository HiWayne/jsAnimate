/*由于css3渐变不支持display等样式属性, 于是用原生js实现类似jQuery-animate的动画效果*/
var jsAnimate = function () {
    //闭包(避免污染全局命名空间),临时储存定时器对象
    var tempShowHideSetTime, tempReturnTopSetTime
    //从display:none到display:block并逐渐显示元素, 参数: 元素节点, 渐变时间s
    function show(node, time) {
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

    //逐渐消失元素并在最后display:none,  参数: 元素节点, 渐变时间s
    function hide(node, time) {
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
    function returnTop(time) {
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

    //轮播图, 参数: 元素节点, 滚动时间s
    function slide(node, intervalTime, slideTime) {
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
        //左右箭头
        var leftArrow = document.createElement("span")
        var rightArrow = document.createElement("span")
        leftArrow.style.cssText = "position:absolute;left:30px;top:50%;margin-top:-35px;width:60px;height:70px;line-height:70px;text-align:center;background:transparent;opacity:0;font-size:50px;color:#eee;transform:scaleY(2);cursor:pointer;transition:all 0.3s ease;"
        rightArrow.style.cssText = "position:absolute;right:30px;top:50%;margin-top:-35px;width:60px;height:70px;line-height:70px;text-align:center;background:transparent;opacity:0;font-size:50px;color:#eee;transform:scaleY(2);cursor:pointer;transition:all 0.3s ease;"
        leftArrow.innerHTML = "<"
        rightArrow.innerHTML = ">"
        //最外层元素鼠标移入移出时改变箭头元素透明度
        eventListener(node, "mouseover", function () {
            leftArrow.style.opacity = 1
            rightArrow.style.opacity = 1
            clearInterval(tempSlideTimeout)
        })
        eventListener(node, "mouseleave", function () {
            leftArrow.style.opacity = 0
            rightArrow.style.opacity = 0
            tempSlideTimeout = imgAutoSlide()
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
        //向根元素插入文档片段
        node.appendChild(fragment)
        //显示初始圆点颜色
        showColor(currentIndex)
        //直接在渲染节点的函数里计算宽度是1920, 因为节点还未完全渲染, 实际是1903, 所以延迟计算
        setTimeout(function () {
            imgWidth = caculateWidth(node, imgWidth)
            //刷新页面后滚动距离回归实际第一张图片位置
            divWrap.scrollLeft = imgWidth
        }, 100)
        //在窗口变化时自动更新width
        eventListener(window, "resize", function () {
            imgWidth = caculateWidth(node, imgWidth)
            divWrap.scrollLeft = imgWidth * currentIndex
        })
        imgAutoSlide()

        //图片自动轮播方法
        function imgAutoSlide() {
            tempSlideTimeout = setInterval(function () {
                right()
            }, intervalTime * 1000)
            return tempSlideTimeout
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
        function graduallymove(index, ) {
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

        //计算真实宽度，不算进border等
        function caculateWidth(node, imgWidth) {
            if (getComputedStyle) {
                imgWidth = parseFloat(getComputedStyle(node, null).width)
            }
            else {
                imgWidth = parseFloat(node.currentStyle.width)
            }
            return imgWidth
        }

        //兼容IE事件监听
        function eventListener(node, eventName, fn, useCapture) {
            if (window.addEventListener) {
                node.addEventListener(eventName, fn, useCapture)
            }
            else {
                node.attachEvent('on' + eventName, fn)
            }
        }
    }

    //返回一个对象object <method>
    return { show: show, hide: hide, returnTop: returnTop, slide: slide }
}()