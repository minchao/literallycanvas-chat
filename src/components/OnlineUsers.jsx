import React, { Component } from 'react'

export default class OnlineUsers extends Component {
  render () {
    return (
      <div id="online-users">
        {this.props.users.map((user) => (<div>{user.name}</div>))}
      </div>
    )
  }
}
