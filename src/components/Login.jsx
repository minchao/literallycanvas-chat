import React, { Component } from 'react'

export default class Login extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      name: ''
    }
  }

  handleChange = (event) => {
    this.setState({name: event.target.value})
  }

  handleSubmit = (event) => {
    if (event.which === 13) {
      // TODO check if exist
      this.props.onSetUser(this.state.name)
    }
  }

  render () {
    if (this.props.user) {
      return null
    } else {
      return (
        <div id="login">
          <div className="login-modal">
            <h1>Login</h1>
            <input
              autoFocus="true"
              placeholder="Please enter your name"
              onChange={this.handleChange}
              onKeyDown={this.handleSubmit}
            />
          </div>
        </div>
      )
    }
  }
}
