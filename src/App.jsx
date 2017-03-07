import React, { Component } from 'react'
import IO from 'socket.io-client'
import LC from 'literallycanvas'
import LiterallyCanvas from 'literallycanvas/lib/js/core/LiterallyCanvas'
import defaultOptions from 'literallycanvas/lib/js/core/defaultOptions'

import Chat from './components/Chat'

export default class App extends Component {
  constructor (props) {
    super(props)

    defaultOptions.backgroundColor = '#fff'
    defaultOptions.imageSize = {width: 1920, height: 1080}
    defaultOptions.imageURLPrefix = '/static/lc-assets/img'

    this.lc = new LiterallyCanvas(defaultOptions)
    this.socket = IO()
  }

  componentDidMount () {
    this.lc.on('shapeSave', (shape) => {
      this.socket.emit('shape', LC.shapeToJSON(shape.shape))
    })

    this.socket.on('shape', (shape) => {
      this.lc.saveShape(LC.JSONToShape(shape), false)
    })
    this.socket.on('user_left', () => {
      console.log('user_left')
    })
  }

  render () {
    return (
      <div id="box">
        <LC.LiterallyCanvasReactComponent
          lc={this.lc}
        />
        <Chat socket={this.socket} />
      </div>
    )
  }
}
