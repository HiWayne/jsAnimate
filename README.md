# jsAnimate（只需一个js，无须css，即可实现`懒加载过渡动画`（综合实现了类似animate.css、wow.js、vue-transition的功能）、`轮播图`、`旋转木马`等特效，可在页面任一处复用，自适应页面尺寸变化，所有方法都在jsAnimate对象中调用）
## 使用：
你可以这样使用jsAnimate.js
```
<script type="text/javascript" src="jsAnimate.js"></script>
```
## 功能更新与演示文档：
<h3>更新时间 updata: 2019.4.3—4.13&nbsp;&nbsp;&nbsp;&nbsp;懒加载过渡动画功能中增加duration属性和transition-enter属性，优化了性能，修复了一些bug(until4.26)。<a href="https://hiwayne.github.io/jsAnimate/lazyfade.html">（点击查看过渡动画lazyfade教程）</a><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现在你可以通过在元素标签里加入duration和transition-enter属性，以显式的定制进入和移出的持续时间、延迟时间、初始过渡样式、贝塞尔曲线(或ease等)。比如，我们可以拥有一个精心编排的一系列过渡效果，其中一些嵌套的内部元素相比于过渡效果的根元素有延迟的或更长的过渡效果。同时还可以搭配自定义动画效果使用，也可以引入第三方动画库，如Animate.css。duration和transition-enter属性的某些用法参考了vue的transition使用风格。所以用过vue的同学可能会比较容易理解上手。</h3><br /><br />
<h3>更新时间 updata: 2019.3.20&nbsp;&nbsp;&nbsp;&nbsp;新增功能--新增类似animate.css和wow.js的懒加载过渡效果: 只需引入jsAnimate.js，然后在你想要的元素class属性里加入相关的类名即可，具体类名对应的效果以及使用中的注意事项，<a href="https://hiwayne.github.io/jsAnimate/lazyfade.html">点击查看过渡动画lazyfade.html中的演示教程</a>，或下载该repository。<br />
  --2019.3.26 新增放大过渡，类名：zoomin、zoomin-r。</h3><br /><br />
<h3>更新时间 update: 2019.3.17&nbsp;&nbsp;&nbsp;&nbsp;新增功能--新增旋转木马效果：方法名jsAnimate.slick。旋转木马插件, 同样只需引入一行js, 可自定义滚动的速度、一页的展示数量、高度、一次滚动一个还是一整页(默认是一次滚动一个)、展示区域内的元素按行还是列排列(默认是列)、是否支持图片缩放、是否支持自动轮播以及轮播速度。<a href="https://hiwayne.github.io/jsAnimate/slick.html">点击查看旋转木马演示slick.html</a>教程在HTML代码中，或下载该repository。</h3><br /><br />
<h3>首次发布时间 uploadTime:2019.3.15&nbsp;&nbsp;&nbsp;&nbsp;目前该插件的亮点是非常方便的轮播图方法。只需要一个div标签将所有img标签嵌套，然后再写一行js即可。可以根据浏览器窗口大小的改变做出自适应。轮播图css样式什么的完全不用管，js会识别里面的img数量并作出相应的处理。如果div里面只有一个img，那么和正常情况下一样，不会有轮播图效果，img宽度会占满div(相当于一张全屏大图)。同时还能自由打开或关闭轮播图中的部分内容样式和功能。<a href="https://hiwayne.github.io/jsAnimate/slide.html">点击查看轮播图演示slide.html</a>教程在HTML代码中，或下载该repository。</h3>

## 最初版本：
<h4>插件有一些动画方法，具体用法如下</h4><br /><br />
jsAnimate对象中目前存放了四个方法<h3>更正，方法有新增：最新的更新在最顶部</h3><br />
分别是: <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;逐渐显示：show(node<object>, time<number>), 在time秒内, node由display: none渐变为display: block<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;逐渐消失：hide(node<object>, time<number>), 在time秒内, node逐渐消失, 最终display: none<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回顶部：returnTop(time<number>), 在time秒内, 页面移动到顶部<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;轮播图：slide(node<object>, intervalTime<number>, scrollTime<number>), 具体用法见上传的例子<br /><br />
以后可能会增加更多方法<br /><br />
尽量不污染全局变量(除了jsAnimate), 可能不兼容IE8以下的浏览器, 未测试<br /><br />
<h3>编写初衷：</h3>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在做公司的官网，本来需求是只放一张图，后来需求又变成三张轮播图，我这边是有同事给我的轮播图插件的，但是每次使用都要引入css、js、HTML结构，我怕麻烦，而且去网上找其他专业的特效库再学习使用更麻烦，所以就想找个极简的方法，于是这个轮播图方法就诞生了。我不知道网上有没有类似或者更方便的方法，但是对于我个人来说，这是一个尝试。另外有一些特效(比如逐渐消失且在页面中不再存在,返回网页顶部等效果),用jQuery的animate写不算很难，但是我更喜欢原生，所以一并写在jsAnimate对象里。<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果有什么bug或者功能扩展，欢迎各路人士交流。
