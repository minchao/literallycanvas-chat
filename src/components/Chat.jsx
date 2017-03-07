import React, { Component } from 'react'
import uuid from 'uuid'

import Messages from './Messages'

export default class Chat extends Component {
  constructor (props, context) {
    super(props, context)
    this.socket = this.props.socket
    this.state = {
      typing: false,
      messages: [],
      text: ''
    }
  }

  componentDidMount () {
    this.socket.on('chat', (message) => {
      this.setState({messages: this.state.messages.concat([message])})
    })
  }

  handleChange = (event) => {
    this.setState({text: event.target.value})
    if (event.target.value.length > 0 && !this.state.typing) {
      this.setState({typing: true})
    }
    if (event.target.value.length === 0 && this.state.typing) {
      this.setState({typing: false})
    }
  }

  handleSubmit = (event) => {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault()

      const text = event.target.value.trim()
      if (text.length === 0) {
        return
      }

      const message = {
        id: uuid.v4(),
        user: 'me',
        text: text
      }

      this.socket.emit('chat', message)
      this.setState({
        typing: false,
        messages: this.state.messages.concat([message]),
        text: ''
      })
    }
  }

  render () {
    return (
      <div id="chat">
        <Messages messages={this.state.messages} />
        <div id="chat-input">
          <textarea
            autoFocus="true"
            placeholder="Type here to chat"
            value={this.state.text}
            onChange={this.handleChange}
            onKeyDown={this.handleSubmit}
          />
        </div>
      </div>
    )
  }
}
