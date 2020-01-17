import Component from '../react/component'
import { setAttribute } from './dom'

// 创建组件
function createComponent(component, props) {
  let inst 
  // 如果是类定义组件，则直接返回实例
  if ( component.prototype && component.prototype.render ) {
      inst = new component( props );
  // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
      inst = new Component( props );
      inst.constructor = component;
      inst.render = function() {
          return this.constructor( props );
      }
  }
  return inst;
}

function unmountComponent( component ) {
    if ( component.componentWillUnmount ) component.componentWillUnmount();
    removeNode( component.base);
}

// 设置组件props
function setComponentProps( component, props ) {

  if ( !component.base ) {
      if ( component.componentWillMount ) component.componentWillMount();
  } else if ( component.componentWillReceiveProps ) {
      component.componentWillReceiveProps( props );
  }

  component.props = props;

  renderComponent( component );
}

// 挂载/更新组件
export function renderComponent( component ) {

  let base;

  const renderer = component.render();

  if ( component.base && component.componentWillUpdate ) {
      component.componentWillUpdate();
  }

  base = _render( renderer );

  if ( component.base ) {
      if ( component.componentDidUpdate ) component.componentDidUpdate();
  } else if ( component.componentDidMount ) {
      component.componentDidMount();
  }

  if ( component.base && component.base.parentNode ) {
      component.base.parentNode.replaceChild( base, component.base );
  }

  component.base = base;
  component.aaa = 111
  base._component = component;
}

function _render ( vnode ) {
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'number') vnode = String(vnode);

  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return textNode
  }

  // 渲染组件
  if (typeof vnode.tag === 'function') {
    const component = createComponent(vnode.tag, vnode.attrs)
    setComponentProps(component, vnode.attrs)
    return component.base;
  }

  const dom = document.createElement(vnode.tag);

  if(vnode.attrs) {
    Object.keys(vnode.attrs).forEach( key => {
      const value = vnode.attrs[key]
      setAttribute(dom, key, value); // 设置属性
    })
  }

  vnode.children && vnode.children.forEach(child => render(child, dom))

  return dom
}

export function render ( vnode, container ) {
  return container.appendChild(_render(vnode))
}
