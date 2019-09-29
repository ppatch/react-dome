import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Input, Button, List } from 'antd'
import store from './store'

class ToDoList extends Component {
  constructor(props) {
    super(props);
    const _store = store.getState()
    this.state = _store
    this.handleInputChange = this.handleInputChange.bind(this)
    this.storeChange = this.storeChange.bind(this)
    store.subscribe(this.storeChange)
  }
  render() { 
    return (  
      <div>
        <div style={{ margin: '20px'}}>
          <Input 
            placeholder={this.state.inputValue}
            style={{ width: '250px', marginRight: '10px'}} 
            onChange={this.handleInputChange}
           />
          <Button type="primary">增加</Button>
        </div>
        <div style={{margin: '10px'}}>
          <List 
            bordered
            dataSource={this.state.list}
            renderItem={item => (<List.Item>{item}</List.Item>)}
          />
         </div>
      </div>
    );
  }

  handleInputChange(e) {
    const action = {
      type: 'changeInput',
      value: e.target.value
    }
    store.dispatch(action)
  }
  
  storeChange() {
    this.setState(store.getState())
  }
}
 
export default ToDoList;