
import { renderComponent } from '../react-dom/diff'

class Component {
  constructor(props = {}) {
    this.isReactComponent = true;

    this.state = {};
    this.props = props;
  }

  setState(stateChange) {
    enqueueSetState(stateChange, this)
    // Object.assign(this.state, stateChange);
    // renderComponent(this);
  }
}

const queue = [];
const renderQueue = [];
function enqueueSetState(stateChange, component) {

  if (queue.length === 0) {
    defer(flush)
  }
  queue.push({
    stateChange, 
    component
  });

  // 如果renderQueue里没有当前组件，则添加到队列中
  if ( !renderQueue.some( item => item === component ) ) {
    renderQueue.push( component );
  }
}

function defer(fn) {
  return Promise.resolve().then(fn)
}

function flush() {
  let item;
  let component;
  while(item = queue.shift()) {
    const { stateChange, component } = item;

    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state);
    };

    if (typeof stateChange === 'function') {
      Object.assign(component.state, stateChange(component.prevState, component.props))
    } else {
      Object.assign(component.state, stateChange)
    }

    component.prevState = component.state
  }

  while(component = renderQueue.shift()) {
    renderComponent(component)
  }
}

export default Component;