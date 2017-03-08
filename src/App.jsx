import React, { Component } from 'react'
import IO from 'socket.io-client'
import LC from 'literallycanvas'
import LiterallyCanvas from 'literallycanvas/lib/js/core/LiterallyCanvas'
import defaultOptions from 'literallycanvas/lib/js/core/defaultOptions'

import Login from './components/Login'
import Chat from './components/Chat'

export default class App extends Component {
  constructor (props) {
    super(props)

    defaultOptions.backgroundColor = '#fff'
    defaultOptions.imageSize = {width: 1920, height: 1080}
    defaultOptions.imageURLPrefix = '/static/lc-assets/img'

    this.socket = null
    this.lc = new LiterallyCanvas(defaultOptions)
    this.lc.on('shapeSave', (shape) => {
      this.socket.emit('shape', LC.shapeToJSON(shape.shape))
    })

    this.state = {
      user: null,
      messages: []
    }
  }

  init = () => {
    this.socket = IO()

    this.socket.on('shape', (shape) => {
      this.lc.saveShape(LC.JSONToShape(shape), false)
    })
    this.socket.on('chat', (message) => {
      this.setState({
        messages: this.state.messages.concat([message])
      })
    })
    this.socket.on('user_left', () => {
      console.log('user_left')
    })

    this.socket.emit('init', {user: this.state.user})
  }

  handleSetUser = (name) => {
    this.setState({user: name}, () => {
      this.init()
    })
  }

  handleChat = (message) => {
    this.setState({
      messages: this.state.messages.concat([message])
    })
    this.socket.emit('chat', message)
  }

  render () {
    return (
      <div id="box">
        <Login
          user={this.state.user}
          onSetUser={this.handleSetUser}
        />
        <LC.LiterallyCanvasReactComponent
          lc={this.lc}
        />
        <Chat
          user={this.state.user}
          messages={this.state.messages}
          handleChat={this.handleChat}
        />
      </div>
    )
  }
}
