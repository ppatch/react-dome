
/**
设置属性需要考虑一些特殊情况，我们单独将其拿出来作为一个方法setAttribute
 */
function setAttribute(dom, name, value) {
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
/**
  从jsx转译结果来看，createElement方法的参数是这样：

  createElement( tag, attrs, child1, child2, child3 );
  第一个参数是DOM节点的标签名，它的值可能是div，h1，span等等
  第二个参数是一个对象，里面包含了所有的属性，可能包含了className，id等等
  从第三个参数开始，就是它的子节点

  我们对createElement的实现非常简单，只需要返回一个对象来保存它的信息就行了。
 */
function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

/**
  所以render的第一个参数实际上接受的是createElement返回的对象，也就是虚拟DOM
  而第二个参数则是挂载的目标DOM

  总而言之，render方法的作用就是将虚拟DOM渲染成真实的DOM，下面是它的实现： 
*/
function render ( vnode, container) {
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return container.appendChild(textNode)
  }

  const dom = document.createElement(vnode.tag);

  if(vnode.attrs) {
    Object.keys(vnode.attrs).forEach( key => {
      const value = vnode.attrs[key]
      setAttribute(dom, key, value); // 设置属性
    })
  }

  vnode.children.forEach(child => render(child, dom))

  return container.appendChild(dom)
}

const React = {
  createElement
}
const ReactDOM = {
  render: (vnode, container) => {
    container.innerHTML = ''
    return render(vnode, container)
  }
}

function handleOnClick() {
  console.log('show handleOnClick console')
}

function tick () {
  const element = (
    <div onClick={handleOnClick} kkk='123'>
      hello <span className='first-class-name  aaa' style={{'font-size': '30px'}}>world</span> patch
    <h2>It is {new Date().toLocaleString()}</h2>
    </div>
  )
  console.log(element)
  ReactDOM.render(element, document.getElementById('root'))
}
tick()
setInterval(tick, 1000)