import React, { Component, Fragment } from 'react'
import './style.css'
import XiaojiejieItem from './XiaojiejieItem'
import Boss from './Boss'
import axios from 'axios'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

class Xiaojiejie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: 'Patch Pan',
      list: []
    }
  }
  componentDidMount() {
    axios.get('https://www.easy-mock.com/mock/5d88766fc030f85c978d0b96/reactDemo01/xiaojiejie')
    .then(res => {
      console.log(JSON.stringify(res.data.data.list))
      this.setState({
        list: res.data.data.list
      })
    })
    .catch(err => {
      console.log('axios 获取数据失败：' + err)
    })
  }
  render() {
    return (
      <Fragment>
        {/* 第一次写注释 */}
        <div>
          <input className="input" value={this.state.inputValue} onChange={this.inputChange.bind(this)} type="text" />
          <button onClick={this.addList.bind(this)}>增加服务</button>
        </div>
        <ul>
          <TransitionGroup

          >
            {
              this.state.list.map((item, index) => {
                return (
                  <CSSTransition
                    timeout={2000}
                    classNames="boss-test"
                    unmountOnExit
                    appear={true}
                    key={index}
                  >
                    <XiaojiejieItem
                      content={item}
                      key={index}
                      index={index}
                      avname='无敌人'
                      deleteItem={this.deleteItem.bind(this)}
                    />
                  </CSSTransition>
                )
              })
            }
          </TransitionGroup>
        </ul>
        <Boss />
      </Fragment>
    )
  }

  inputChange(e) {
    this.setState({
      inputValue: e.target.value
    })
  }

  // 增加列表
  addList() {
    if (!this.state.inputValue) return
    this.setState({
      list: [...this.state.list, this.state.inputValue],
      inputValue: ''
    })
  }

  // 删除列表项
  deleteItem(index) {
    // let list = this.state.list
    let list = this.state.list.concat()
    list.splice(index, 1)
    this.setState({
      list: list
    })
  }
}

export default Xiaojiejie