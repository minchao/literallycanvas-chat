import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import App from './App'

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Component imageSize={{width: 1920, height: 1080}} />
        </AppContainer>,
        document.getElementById('main')
    )
}

render(App)

if (module.hot) {
    module.hot.accept('./App', () => {
        render(App)
    })
}
