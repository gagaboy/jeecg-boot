/**
 * textarea 增加字数统计功能
 * <a-textarea v-showCount="textLength" :max-length="100" />
 */

export default {
  inserted(el, binding, vnode) {
    const { maxLength } = vnode.componentInstance
    if (el.tagName !== 'TEXTAREA') {
      console.warn('v-show-count 指令并未适配除textarea以外的元素，结果可能异常')
    }
    el.maxlength = maxLength

    const wrap = document.createElement('div')
    const countSpan = document.createElement('span')

    wrap.style.position = 'relative'

    el.parentNode.replaceChild(wrap, el)
    wrap.appendChild(el)

    countSpan.style = `line-height:1.5;color:#cecece;position:absolute;background:rgba(255,255,255,.5);bottom:10px;right:10px;padding:0 5px;border-radius:3px`

    countSpan.innerText = `${binding.value}/${maxLength}`

    el.countSpan = countSpan

    wrap.appendChild(countSpan)
  },
  update (el, binding) {
    el.countSpan.innerText = `${binding.value}/${el.maxlength}`
  }
}
