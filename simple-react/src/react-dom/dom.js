/**
设置属性需要考虑一些特殊情况，我们单独将其拿出来作为一个方法setAttribute
 */
export const setAttribute = (dom, name, value) => {
  // 如果属性名是classname,则改回class
  if (name === 'className') name = 'class';

  // 如果属性名是onXXX,则是一个事件监听方法
  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || ''
    // 如果属性名是style,则更新style对象
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object') {
      for(let name in value) {
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
      }
    }
  } else {
    if (name !== "class" && name in dom) {
      dom[name] = value || ''
    }

    if (value) {
      dom.setAttribute(name, value)
    } else {
      dom.removeAttribute(name)
    }
  }
  // 普通属性则直接更新属性
}