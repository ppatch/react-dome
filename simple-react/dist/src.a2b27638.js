// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/react-dom/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAttribute = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
设置属性需要考虑一些特殊情况，我们单独将其拿出来作为一个方法setAttribute
 */
var setAttribute = function setAttribute(dom, name, value) {
  // 如果属性名是classname,则改回class
  if (name === 'className') name = 'class'; // 如果属性名是onXXX,则是一个事件监听方法

  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || ''; // 如果属性名是style,则更新style对象
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && _typeof(value) === 'object') {
      for (var _name in value) {
        dom.style[_name] = typeof value[_name] === 'number' ? value[_name] + 'px' : value[_name];
      }
    }
  } else {
    if (name !== "class" && name in dom) {
      dom[name] = value || '';
    }

    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  } // 普通属性则直接更新属性

};

exports.setAttribute = setAttribute;
},{}],"src/react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.renderComponent = renderComponent;

var _react = require("../react");

var _dom = require("./dom");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
function diff(dom, vnode, container) {
  var ret = diffNode(dom, vnode);

  if (container && ret.parentNode !== container) {
    container.appendChild(ret);
  }

  return ret;
}

function diffNode(dom, vnode) {
  var out = dom;
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode); // diff text node

  if (typeof vnode === 'string') {
    // 如果当前的DOM就是文本节点，则直接更新内容
    if (dom && dom.nodeType === 3) {
      // nodeType: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      } // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的

    } else {
      out = document.createTextNode(vnode);

      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }

    return out;
  }

  if (typeof vnode.tag === 'function') {
    return diffComponent(dom, vnode);
  } //


  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag);

    if (dom) {
      _toConsumableArray(dom.childNodes).map(out.appendChild); // 将原来的子节点移到新节点下


      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom); // 移除掉原来的DOM对象
      }
    }
  }

  if (vnode.children && vnode.children.length > 0 || out.childNodes && out.childNodes.length > 0) {
    diffChildren(out, vnode.children);
  }

  diffAttributes(out, vnode);
  return out;
}

function diffChildren(dom, vchildren) {
  var domChildren = dom.childNodes;
  var children = [];
  var keyed = {}; // 将有key的节点和没有key的节点分开

  if (domChildren.length > 0) {
    for (var i = 0; i < domChildren.length; i++) {
      var child = domChildren[i];
      var key = child.key;

      if (key) {
        keyedLen++;
        keyed[key] = child;
      } else {
        children.push(child);
      }
    }
  }

  if (vchildren && vchildren.length > 0) {
    var min = 0;
    var childrenLen = children.length;

    for (var _i = 0; _i < vchildren.length; _i++) {
      // debugger
      var vchild = vchildren[_i];
      var _key = vchild.key;

      var _child = void 0; // 如果有key，找到对应key值的节点


      if (_key) {
        if (keyed[_key]) {
          _child = keyed[_key];
          keyed[_key] = undefined;
        } // 如果没有key，则优先找类型相同的节点

      } else if (min < childrenLen) {
        for (var j = min; j < childrenLen; j++) {
          var c = children[j];

          if (c && isSameNodeType(c, vchild)) {
            _child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      } // 对比


      _child = diff(_child, vchild); // 更新DOM

      var f = domChildren[_i];

      if (_child && _child !== dom && _child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(_child); // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
        } else if (_child === f.nextSibling) {
          removeNode(f); // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
          dom.insertBefore(_child, f);
        }
      }
    }
  }
}

function diffComponent(dom, vnode) {
  var c = dom && dom._component;
  var oldDom = dom; // 如果组件类型没有变化，则重新set props

  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode.attrs);
    dom = c.base; // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
  } else {
    if (c) {
      unmountComponent(c);
      oldDom = null;
    }

    c = createComponent(vnode.tag, vnode.attrs);
    setComponentProps(c, vnode.attrs);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }
  }

  return dom;
}

function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  component.props = props;
  renderComponent(component);
}

function renderComponent(component) {
  var base;
  var renderer = component.render();

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  base = diffNode(component.base, renderer);
  component.base = base;
  base._component = component;

  if (component.base) {
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }

  component.base = base;
  base._component = component;
}

function createComponent(component, props) {
  var inst;

  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    inst = new Component(props);
    inst.constructor = component;

    inst.render = function () {
      return this.constructor(props);
    };
  }

  return inst;
}

function unmountComponent(component) {
  if (component.componentWillUnmount) component.componentWillUnmount();
  removeNode(component.base);
}

function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3;
  }

  if (typeof vnode.tag === 'string') {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }

  return dom && dom._component && dom._component.constructor === vnode.tag;
}

function diffAttributes(dom, vnode) {
  var old = {}; // 当前DOM的属性

  var attrs = vnode.attrs; // 虚拟DOM的属性

  for (var i = 0; i < dom.attributes.length; i++) {
    var attr = dom.attributes[i];
    old[attr.name] = attr.value;
  } // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）


  for (var name in old) {
    if (!(name in attrs)) {
      (0, _dom.setAttribute)(dom, name, undefined);
    }
  } // 更新新的属性值


  for (var _name in attrs) {
    if (old[_name] !== attrs[_name]) {
      (0, _dom.setAttribute)(dom, _name, attrs[_name]);
    }
  }
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }
}
},{"../react":"src/react/index.js","./dom":"src/react-dom/dom.js"}],"src/react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _diff = require("../react-dom/diff");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component =
/*#__PURE__*/
function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.isReactComponent = true;
    this.state = {};
    this.props = props;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(stateChange) {
      enqueueSetState(stateChange, this); // Object.assign(this.state, stateChange);
      // renderComponent(this);
    }
  }]);

  return Component;
}();

var queue = [];
var renderQueue = [];

function enqueueSetState(stateChange, component) {
  if (queue.length === 0) {
    defer(flush);
  }

  queue.push({
    stateChange: stateChange,
    component: component
  }); // 如果renderQueue里没有当前组件，则添加到队列中

  if (!renderQueue.some(function (item) {
    return item === component;
  })) {
    renderQueue.push(component);
  }
}

function defer(fn) {
  return Promise.resolve().then(fn);
}

function flush() {
  var item;
  var component;

  while (item = queue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        _component = _item.component;

    if (!_component.prevState) {
      _component.prevState = Object.assign({}, _component.state);
    }

    ;

    if (typeof stateChange === 'function') {
      Object.assign(_component.state, stateChange(_component.prevState, _component.props));
    } else {
      Object.assign(_component.state, stateChange);
    }

    _component.prevState = _component.state;
  }

  while (component = renderQueue.shift()) {
    (0, _diff.renderComponent)(component);
  }
}

var _default = Component;
exports.default = _default;
},{"../react-dom/diff":"src/react-dom/diff.js"}],"src/react/create-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createElement(tag, attrs) {
  attrs = attrs || {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    children: children,
    key: attrs.key || null
  };
}

var _default = createElement;
exports.default = _default;
},{"./component.js":"src/react/component.js"}],"src/react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component.js"));

var _createElement = _interopRequireDefault(require("./create-element.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Component: _component.default,
  createElement: _createElement.default
};
exports.default = _default;
},{"./component.js":"src/react/component.js","./create-element.js":"src/react/create-element.js"}],"src/react-dom/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _diff = require("./diff");

function _render(vnode, container) {
  if (vnode === undefined) return;

  if (vnode.isReactComponent) {
    var component = vnode;

    if (component._container) {
      if (component.componentWillUpdate) {
        component.componentWillUpdate();
      }
    } else if (component.componentWillMount) {
      component.componentWillMount();
    }

    component._container = container; // 保存父容器信息，用于更新

    vnode = component.render();
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    var textNode = document.createTextNode(vnode);
    return container.appendChild(textNode);
  }

  var dom = document.createElement(vnode.tag);

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(function (key) {
      var value = vnode.attrs[key];
      if (key === 'className') key = 'class'; // 如果是事件监听函数，则直接附加到dom上

      if (typeof value === 'function') {
        dom[key.toLowerCase()] = value;
      } else {
        dom.setAttribute(key, vnode.attrs[key]);
      }
    });
  }

  if (vnode.children) {
    vnode.children.forEach(function (child) {
      return _render(child, dom);
    });
  }

  return container.appendChild(dom);
}

function render(vnode, container, dom) {
  return (0, _diff.diff)(dom, vnode, container);
}

var _default = render;
exports.default = _default;
},{"./diff":"src/react-dom/diff.js"}],"src/react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactDOM = {
  render: _render.default
};
var _default = ReactDOM;
exports.default = _default;
},{"./render":"src/react-dom/render.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("./react"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Counter =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Counter, _React$Component);

  function Counter(props) {
    var _this;

    _classCallCheck(this, Counter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Counter).call(this, props));
    _this.state = {
      num: 1
    };
    return _this;
  }

  _createClass(Counter, [{
    key: "onClick",
    value: function onClick() {
      for (var i = 0; i < 10; i++) {
        this.setState(function (prveState) {
          console.log(prveState);
          return {
            num: prveState.num + 1
          };
        });
        console.log(this.state.num);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("div", {
        onClick: this.props.onClick
      }, _react.default.createElement("h1", null, "count: ", this.state.num), _react.default.createElement("button", {
        onClick: function onClick() {
          return _this2.onClick();
        }
      }, "add"));
    }
  }]);

  return Counter;
}(_react.default.Component);

var Hello =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Hello, _React$Component2);

  function Hello(props) {
    var _this3;

    _classCallCheck(this, Hello);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Hello).call(this, props));
    _this3.state = {
      name: 'patch'
    };
    return _this3;
  }

  _createClass(Hello, [{
    key: "render",
    value: function render() {
      var name = this.state.name;
      return _react.default.createElement("div", null, "hello, ", name);
    }
  }]);

  return Hello;
}(_react.default.Component);

var App =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(App, _React$Component3);

  function App(props) {
    var _this4;

    _classCallCheck(this, App);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this4.state = {};
    return _this4;
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      var tree = _react.default.createElement("div", null, _react.default.createElement("div", null, "hello, ", this.props.name), _react.default.createElement(Counter, null));

      return tree;
    }
  }]);

  return App;
}(_react.default.Component);

_reactDom.default.render(_react.default.createElement(App, {
  name: 'patch'
}), document.getElementById('root'));
},{"./react":"src/react/index.js","./react-dom":"src/react-dom/index.js"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51703" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map