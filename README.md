# jsAnimate(有注释Comment out)
<h2>update: 2019.3.17&nbsp;&nbsp;&nbsp;&nbsp;新增旋转木马效果：方法名jsAnimate.slick，示例slick.html。旋转木马插件, 同样只需引入一行js, 可自定义滚动的速度、一页的展示数量、高度、一次滚动一个还是一整页(默认是一次滚动一个)、展示区域内的元素按行还是列排列(默认是列)、是否支持图片缩放</h2><br /><br />
<h4>uploadTime:2019.3.15&nbsp;&nbsp;&nbsp;&nbsp;目前该插件的亮点是非常方便的轮播图方法，示例slice.html，下载例子可见。只需要一个div标签将所有img标签嵌套，然后再写一行js即可。可以根据浏览器窗口大小的改变做出自适应。轮播图css样式什么的完全不用管，js会识别里面的img数量并作出相应的处理。如果div里面只有一个img，那么和正常情况下一样，不会有轮播图效果，img宽度会占满div(相当于一张全屏大图)。该插件的缺点就是轮播图的整体样式是固定的。</h4>
<h4>同时还有一些其他的小动画方法，具体用法如下</h4><br /><br />
jsAnimate对象中目前存放了四个方法<br />
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
