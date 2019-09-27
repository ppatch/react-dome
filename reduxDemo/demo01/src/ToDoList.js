import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Input, Button, List } from 'antd'
import store from './store'

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return (  
      <div>
        <div style={{ margin: '20px'}}>
          <Input 
            placeholder="Write Sometion"
            style={{ width: '250px', marginRight: '10px'}} 
           />
          <Button type="primary">增加</Button>
        </div>
        <div style={{margin: '10px'}}>
          <List 
            bordered
            dataSource={[]}
            renderItem={item => (<List.Item>item</List.Item>)}
          />
         </div>
      </div>
    );
  }
}
 
export default ToDoList;