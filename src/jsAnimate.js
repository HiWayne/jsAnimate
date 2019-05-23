import { eventListener } from './util'
import { show } from './smallAnimate'
import { hide } from './smallAnimate'
import { returnTop } from './smallAnimate'
import fade from './lazyFade'
import slide from './slide'
import slick from './slick'

export default window.jsAnimate = function () {
    //绑定类似animate.css的懒加载过渡效果
    eventListener(window, "load", fade)

    //返回一个对象object <method>
    return { show: show, hide: hide, returnTop: returnTop, slide: slide, slick: slick }
}()
