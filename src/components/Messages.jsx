import React, { Component } from 'react'

export default class Messages extends Component {
  constructor (props, context) {
    super(props, context)
    this.count = 0
  }

  componentDidUpdate () {
    const count = this.props.messages.length
    if (count > this.count) {
      this.refs[this.props.messages.length - 1].scrollIntoView()
    }
    this.count = count
  }

  render () {
    const toBr = (item, key) => (<span key={key}>{item}<br /></span>)
    const style = (message) => {
      let s = null
      switch (message.user) {
        case this.props.user:
          s = {color: 'blue'}
          break
        case 'PaintChat':
          s = {color: 'gray'}
          break
      }
      return s
    }

    return (
      <div id="messages">
        <div className="messages-content">
          {this.props.messages.map((message, i) => (
            <div
              key={message.id}
              ref={i}
              style={style(message)}
            >{message.user}: {message.text.split('\n').map(toBr)}</div>
          ))}
        </div>
      </div>
    )
  }
}
