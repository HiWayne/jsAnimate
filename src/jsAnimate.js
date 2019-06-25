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

    //slick和slide函数的适配器，适用于同个页面有多个旋转木马效果或轮播图的场景，且它们使用同样的配置参数
    function adapter(method) {
        return function adapterMehtod(idArray, config) {
            if (arguments.length === 1 && Object.prototype.toString.call(arguments[0]) === "[object Object]") {
                method(arguments[0])
                return
            }
            if (!Array.isArray(idArray)) {
                throw new Error(`${idArray} is not array`)
            }
            if (Object.prototype.toString.call(config) !== "[object Object]") {
                throw new Error(`${config} is not object`)
            }
            idArray.forEach(function (id) {
                method(Object.assign({ id: id }, config))
            })
        }
    }

    //返回一个对象object <method>
    return { show: show, hide: hide, returnTop: returnTop, slide: adapter(slide), slick: adapter(slick) }
}()
