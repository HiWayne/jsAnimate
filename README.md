# jsAnimate（只需一个js，无须css，即可实现`懒加载过渡动画`（综合实现了类似animate.css、wow.js、vue-transition的功能）、`轮播图`、`旋转木马`等特效，可在页面任一处复用，自适应页面尺寸变化，所有方法都在jsAnimate对象中调用）
## 使用：(文档中有在线查看demo和教程的链接)
使用dist文件夹中打包后的jsAnimate.js<br/><br/>
如果你通过<script>方式使用jsAnimate.js，你可以通过window.jsAnimate全局变量来使用jsAnimate对象
```
<script type="text/javascript" src="jsAnimate.js"></script>
```
同时jsAnimate.js也支持通过ES6模块化的方式引入
```
import jsAnimate from 'jsAnimate.js'
```
开发环境下调试先安装依赖
```
npm install
```
打开本地服务器
```
npm run serve
```
打包
```
npm run build
```
## 功能更新与演示文档：
<h3>更新时间 updata: 2019.6.25&nbsp;&nbsp;&nbsp;&nbsp;升级旋转木马和轮播图的api(向后兼容)，适用于同一页面有多个旋转木马或轮播图，且它们使用相同的配置参数的场景。将多个id以数组的形式作为第一个参数，除id外的配置对象作为第二个参数。之前的单参数api依然支持。</h3><br /><br />
<h3>更新时间 updata: 2019.5.23&nbsp;&nbsp;&nbsp;&nbsp;jsAnimate.js模块化重构，打包后的文件在dist目录，模块化源文件在src目录，旧的js单文件在oldfile目录。注意：轮播图插件中图片引用于网络，因为域名到期原因，可能无法打开(现在可以打开了)，可以在本地HTML中替换成自己的图片查看效果。</h3><br /><br />
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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;轮播图：slide(node<object>, intervalTime<number>, scrollTime<number>), 具体用法见上传的例子(在最新的版本中api已改变)<br /><br />
以后可能会增加更多方法<br /><br />
所有的方法都在全局变量(模块化引入时除外)jsAnimate对象中, 可能不兼容IE8以下的浏览器, 未测试<br /><br />
<h3>编写初衷：</h3>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在做公司的官网，本来需求是只放一张图，后来需求又变成三张轮播图(轮播图样式无所谓)，我的同事有网上找的轮播图插件的，但是每次使用都要引入css、js、HTML结构，我嫌麻烦，而且去网上找其他的特效库再学习使用更麻烦，所以就想找个极简的方法，在不追求性能的情况下，能够只用js一次引入，于是这个轮播图方法就诞生了。我不知道网上有没有类似或者更方便的方法，但是对于我个人来说，这是一个尝试。另外有一些特效(比如逐渐消失且在页面中不再存在,返回网页顶部等效果),用jQuery的animate写不算很难，但是我更喜欢原生，所以一并写在jsAnimate对象里。——— 最初版本写于2019年3月15号。<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果有什么bug或者想要什么功能扩展，欢迎各路人士交流。<br/><br/><br/>
PS：最初写该插件的时候我还不会babel和webpack，所以为了浏览器兼容性，我用ES5写的，有些情况其实ES6很容易能解决，但在ES5里不得不通过闭包等方式解决。两个月后我用模块化方式简单重构了1000多行的js文件，并用webpack打包，所以如果你发现src里既有ES6的module，又有大片的ES5语法，不要觉得奇怪。
