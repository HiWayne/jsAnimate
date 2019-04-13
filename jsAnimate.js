var jsAnimate = function () {
    //绑定类似animate.css的懒加载过渡效果
    eventListener(window, "load", fade)

    //闭包(避免污染全局命名空间),临时储存定时器对象
    var tempShowHideSetTime, tempReturnTopSetTime

    //从display:none到display:block并逐渐显示元素, 参数: 元素节点id, 渐变时间s
    function show(id, time) {
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
    function hide(id, time) {
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
    function returnTop(time) {
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

    //轮播图, 参数: 元素节点, 滚动时间s
    function slide(object) {
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

    //旋转木马方法
    function slick(object) {
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

    //类似animate.css的过渡效果
    function fade() {
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
            if (lazyDocuments[i].getAttribute('duration')) {
                var key, value
                var durationString = lazyDocuments[i].getAttribute('duration').trim()
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
                        if (lazyNode.offsetTop <= clientHeight * 9 / 10 && lazyNode.offsetTop >= clientHeight / 8) {
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
                        else if (lazyNode.offsetTop < clientHeight / 8 || lazyNode.offsetTop > clientHeight * 9 / 10) {
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
                    lazyNodeArray.forEach(function (object) {
                        if (object.duration.target && object.duration.target === 'target' + postfix) {
                            if (object.delay) {
                                delay = parseFloat(object.delay) + (object.duration.enter || 1000)
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

    //对象接口
    function objectInterface(object, type) {
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

    //返回一个对象object <method>
    return { show: show, hide: hide, returnTop: returnTop, slide: slide, slick: slick }
}()