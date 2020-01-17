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
        hello, {this.props.name}
        <h1>count: {this.state.num}</h1>
        <button onClick={() => this.onClick()}>add</button>
      </div>
    );
  }
}

function handleOnClick() { console.log('onClick')}

ReactDOM.render(
  <Counter name='kkk' onClick={handleOnClick}/>,
  document.getElementById('root')
);