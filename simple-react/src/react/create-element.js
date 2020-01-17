
/**
  从jsx转译结果来看，createElement方法的参数是这样：

  createElement( tag, attrs, child1, child2, child3 );
  第一个参数是DOM节点的标签名，它的值可能是div，h1，span等等
  第二个参数是一个对象，里面包含了所有的属性，可能包含了className，id等等
  从第三个参数开始，就是它的子节点

  我们对createElement的实现非常简单，只需要返回一个对象来保存它的信息就行了。
 */
const createElement = (tag, attrs, ...children) => {
  return {
    tag,
    attrs,
    children
  }
}
export default createElement;