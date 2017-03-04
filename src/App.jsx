import React, {Component} from 'react'
import LC from 'literallycanvas'

export default class App extends Component {
    render() {
        return (
            <LC.LiterallyCanvasReactComponent
                imageSize={this.props.imageSize}
                imageURLPrefix="/static/lc-assets/img"
            />
        )
    }
}
