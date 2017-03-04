import React, {Component} from 'react'
import LC from 'literallycanvas'

export default class App extends Component {
    render() {
        return (
            <LC.LiterallyCanvasReactComponent
                backgroundColor="#fff"
                imageSize={{width: 1920, height: 1080}}
                imageURLPrefix="/static/lc-assets/img"
            />
        )
    }
}
