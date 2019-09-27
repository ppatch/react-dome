import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'

class XiaojiejieItem extends Component {
  constructor(props) {
    super(props)
    this.deleteItem = this.deleteItem.bind(this)
  }
  
  render() { 
    return (  
      <Fragment>
        <li onClick={this.deleteItem}>{this.props.avname}帮我服务：{this.props.content}</li>
      </Fragment>
    );
  }

  deleteItem() {
    const index = this.props.index
    this.props.deleteItem(index)
  }
}

XiaojiejieItem.defaultProps = {
  avname: '小姐姐'
}

XiaojiejieItem.propTypes = {
  content: PropTypes.string,
  
}
export default XiaojiejieItem;