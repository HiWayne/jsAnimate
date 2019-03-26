var jsAnimate = function () {
    //绑定类似animate.css的懒加载过渡效果
    eventListener(window, "load", fade)

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
            imgWidth = caculateWidth(node)
            //刷新页面后滚动距离回归实际第一张图片位置
            divWrap.scrollLeft = imgWidth
        }, 100)
        //在窗口变化时自动更新width
        eventListener(window, "resize", function () {
            imgWidth = caculateWidth(node)
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

    //旋转木马方法
    function slick(node, slideTime, number, height, quick, row, imgScale) {
        //若不传参的默认参数
        number = number || 5
        height = height || 120
        //长宽比例系数, 刷新率, 限制点击频率, 临时储存定时器, ul长度, 当前滚动张数
        var scale, refresh = 10, debounce, tempMoveTimeout, ulWidth, currentIndex = 0
        //添加node样式
        node.style.cssText = "position:relative;margin:0;padding:0 45px;overflow:hidden;"
        //创建文档片段
        var fragment = document.createDocumentFragment()
        //创建滚动div
        var divWrap = document.createElement("div")
        //添加divWrap样式
        divWrap.style.overflow = "hidden"
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
        //需要单独拉伸<、>
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

        //根据屏幕变化重新渲染相关元素的尺寸
        function renderSize(plateWidth) {
            itemWidth = plateWidth / number - 20
            height = itemWidth / scale
            node.style.height = height + "px"
            for (var k = 0; k < divWrap.children.length; k++) {
                var itemUl = divWrap.children
                for (var l = 0; l < itemUl[k].children.length; l++) {
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

    //类似animate.css的过渡效果
    function fade() {
        //所有需要懒加载的元素, 存放懒加载元素相关数据的数组, 窗口高度, 函数节流变量
        var lazyDocuments, lazyNodeArray = [], clientHeight, throttle
        lazyDocuments = document.getElementsByClassName("lazyfade")
        clientHeight = getClientHeight()
        for (var i = 0; i < lazyDocuments.length; i++) {
            var direction, reverse, zoom
            //因为考虑到兼容性这里用var声明变量，所以它现在是fade函数的全局变量，每次循环都用的同一个reverse，如果reverse希望为false必须reverse = undefined，否则reverse是上一次的赋值。或者用自执行函数也可以解决。
            lazyDocuments[i].style.opacity = 0
            direction = "fade"
            if (lazyDocuments[i].classList.contains("zoomin")) {
                lazyDocuments[i].style.transform = "scale(0, 0)"
                zoom = "zoomin"
                reverse = reverse ? reverse : undefined
            }
            if (lazyDocuments[i].classList.contains("zoomin-r")) {
                lazyDocuments[i].style.transform = "scale(0, 0)"
                zoom = "zoomin-r"
                reverse = true
            }
            if (lazyDocuments[i].classList.contains("fadein-left")) {
                lazyDocuments[i].style.transform += " translateX(-300px)"
                direction = "left"
                reverse = reverse ? reverse : undefined
            }
            if (lazyDocuments[i].classList.contains("fadein-right")) {
                lazyDocuments[i].style.transform += " translateX(300px)"
                direction = "right"
                reverse = reverse ? reverse : undefined
            }
            if (lazyDocuments[i].classList.contains("fadein-top")) {
                lazyDocuments[i].style.transform += " translateY(-300px)"
                direction = "top"
                reverse = reverse ? reverse : undefined
            }
            if (lazyDocuments[i].classList.contains("fadein-bottom")) {
                lazyDocuments[i].style.transform += " translateY(300px)"
                direction = "bottom"
                reverse = reverse ? reverse : undefined
            }
            if (lazyDocuments[i].classList.contains("fadein-left-r")) {
                lazyDocuments[i].style.transform += " translateX(-300px)"
                direction = "left"
                reverse = true
            }
            if (lazyDocuments[i].classList.contains("fadein-right-r")) {
                lazyDocuments[i].style.transform += " translateX(300px)"
                direction = "right"
                reverse = true
            }
            if (lazyDocuments[i].classList.contains("fadein-top-r")) {
                lazyDocuments[i].style.transform += " translateY(-300px)"
                direction = "top"
                reverse = true
            }
            if (lazyDocuments[i].classList.contains("fadein-bottom-r")) {
                lazyDocuments[i].style.transform += " translateY(300px)"
                direction = "bottom"
                reverse = true
            }
            if (lazyDocuments[i].classList.contains("lazyfade-r")) {
                direction = "fade"
                reverse = true
            }
            var nodeData = {
                node: lazyDocuments[i],
                offsetTop: lazyDocuments[i].getBoundingClientRect().top,
                direction: direction,
                zoom: zoom,
                hasFadeIn: undefined,
                hasFadeOut: undefined,
                reverse: reverse
            }
            lazyNodeArray.push(nodeData)
            //每次循环清除全局变量也是一个方法
            reverse = undefined
            zoom = undefined

            eventListener(window, "scroll", lazyAnimation)
            eventListener(window, "scroll", throttleMethod)
            //页面打开时初始过渡
            lazyAnimation()
        }

        //懒加载动画
        function lazyAnimation() {
            if (throttle) return
            lazyNodeArray.forEach(function (lazyNode) {
                //在fade函数中会造成不希望的过渡效果
                if (!lazyNode.node.style.transition) {
                    lazyNode.node.style.transition = "all 1s ease-in-out"
                }
                //更新元素据窗口顶部距离
                lazyNode.offsetTop = lazyNode.node.getBoundingClientRect().top
                if (!lazyNode.reverse) {
                    if (lazyNode.offsetTop <= clientHeight && lazyNode.offsetTop >= 0) {
                        if (lazyNode.hasFadeIn) return
                        lazyNode.hasFadeIn = true
                        lazyNode.node.style.transform = "scale(1, 1) translate(0,0)"
                        lazyNode.node.style.opacity = 1
                    }
                }
                //元素离开窗口时动画反转
                else {
                    if (lazyNode.offsetTop <= clientHeight * 9 / 10 && lazyNode.offsetTop >= clientHeight / 8) {
                        if (lazyNode.hasFadeIn) return
                        lazyNode.hasFadeIn = true
                        lazyNode.node.style.transform = "scale(1, 1) translate(0,0)"
                        lazyNode.node.style.opacity = 1
                        setTimeout(function () {
                            lazyNode.hasFadeIn = false
                        }, 1000)
                    }
                    else if (lazyNode.offsetTop < clientHeight / 8 || lazyNode.offsetTop > clientHeight * 9 / 10) {
                        if (lazyNode.hasFadeIn) return
                        //需要清除反转之前的样式
                        lazyNode.node.style.transform = ""
                        switch (lazyNode.zoom) {
                            case "zoomin-r":
                                lazyNode.node.style.transform = "scale(0, 0)"
                                lazyNode.node.style.opacity = 0
                                break
                        }
                        switch (lazyNode.direction) {
                            case "left":
                                lazyNode.node.style.transform += " translateX(-300px)"
                                lazyNode.node.style.opacity = 0
                                break
                            case "right":
                                lazyNode.node.style.transform += " translateX(300px)"
                                lazyNode.node.style.opacity = 0
                                break
                            case "top":
                                lazyNode.node.style.transform += " translateY(-300px)"
                                lazyNode.node.style.opacity = 0
                                break
                            case "bottom":
                                lazyNode.node.style.transform += " translateY(300px)"
                                lazyNode.node.style.opacity = 0
                                break
                            case "fade":
                                lazyNode.node.style.opacity = 0
                                break
                        }
                    }
                }
            })
        }

        //scroll事件函数节流
        function throttleMethod() {
            if (throttle) return
            throttle = true
            setTimeout(function () {
                throttle = false
            }, 10)
        }
    }

    //计算真实宽度，不算进border等
    function caculateWidth(node) {
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
    function eventListener(node, eventName, fn, useCapture) {
        if (window.addEventListener) {
            node.addEventListener(eventName, fn, useCapture)
        }
        else {
            node.attachEvent('on' + eventName, fn)
        }
    }

    //返回窗口高度
    function getClientHeight() {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        else {
            var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        return clientHeight;
    }

    //返回一个对象object <method>
    return { show: show, hide: hide, returnTop: returnTop, slide: slide, slick: slick }
}()