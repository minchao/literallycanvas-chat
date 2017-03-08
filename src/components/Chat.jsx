import React, { Component } from 'react'
import uuid from 'uuid'

import Messages from './Messages'
import OnlineUsers from './OnlineUsers'

export default class Chat extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      typing: false,
      text: ''
    }
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

      this.setState({
        typing: false,
        text: ''
      })

      const message = {
        id: uuid.v4(),
        user: this.props.user,
        text: text
      }
      this.props.handleChat(message)
    }
  }

  render () {
    return (
      <div id="chat">
        <Messages
          messages={this.props.messages}
          user={this.props.user}
        />
        <OnlineUsers
          users={this.props.users}
        />
        <div id="chat-input">
          <textarea
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
