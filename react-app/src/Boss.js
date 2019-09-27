import React, { Component } from 'react';
// - Transition
// - CSSTransition
// - TransitionGroup
import { CSSTransition } from 'react-transition-group'
class Boss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true 
     }
     this.toToggole = this.toToggole.bind(this)
  }
  render() { 
    return (
       <div>
         <CSSTransition
          in={this.state.isShow}
          timeout={2000}
          classNames="boss-test"
          unmountOnExit
         >
           <div >Boss 级任务-牛大春</div>
         </CSSTransition>
         <div>
           <button onClick={this.toToggole}>Boss action</button>
          </div>
       </div> 
     );
  }
  toToggole() {
    this.setState({
      isShow: !this.state.isShow
    })
  }
}
 
export default Boss
