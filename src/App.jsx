import React, {Component} from 'react'
import io from 'socket.io-client'
import LC from 'literallycanvas'
import LiterallyCanvas from 'literallycanvas/lib/js/core/LiterallyCanvas'
import defaultOptions from 'literallycanvas/lib/js/core/defaultOptions'

export default class App extends Component {
    constructor(props) {
        super(props)

        defaultOptions.backgroundColor = '#fff'
        defaultOptions.imageSize = {width: 1920, height: 1080}
        defaultOptions.imageURLPrefix = '/static/lc-assets/img'

        this.lc = new LiterallyCanvas(defaultOptions)
        this.socket = io()
    }

    componentDidMount() {
        this.lc.on('shapeSave', (shape, previousShapeId) => {
            this.socket.emit('shape', LC.shapeToJSON(shape.shape))
        })

        this.socket.on('shape', (shape) => {
            this.lc.saveShape(LC.JSONToShape(shape), false)
        })
        this.socket.on('user_left', () => {
            console.log('user_left')
        })
    }

    render() {
        return (
            <LC.LiterallyCanvasReactComponent
                lc={this.lc}
            />
        )
    }
}
