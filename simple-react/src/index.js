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
    for(let i = 0; i < 10; i++) {
      this.setState(prveState => {
        console.log(prveState)
        return {
          num: prveState.num + 1
        }
      });
      console.log(this.state.num)
    }
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