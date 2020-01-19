import React from './react'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 1
    }
  }

  onClick() {
    this.setState({ num: this.state.num + 1 });
  }

  render() {
    return (
      <div onClick={this.props.onClick}>
        <h1>count: {this.state.num}</h1>
        <button onClick={() => this.onClick()}>add</button>
      </div>
    );
  }
}
class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'patch'
    }
  }

  render() {
    const { name } = this.state

    return (
      <div>
        hello, {name}
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const tree = (
      <div>
        <div>hello, {this.props.name}</div>
         <Counter />
      </div>
    )
    return tree
  }
}

ReactDOM.render(
  <App name='patch'/>,
  document.getElementById('root')
);