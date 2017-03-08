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

    return (
      <div id="messages">
        {this.props.messages.map((message, i) => (
          <div
            key={message.id}
            ref={i}
            style={{color: (message.user === this.props.user ? 'blue' : null)}}
          >{message.user}: {message.text.split('\n').map(toBr)}</div>
        ))}
      </div>
    )
  }
}
