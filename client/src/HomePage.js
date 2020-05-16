import React from 'react';
import { setUsername, createRoom, joinRoom, connectSocket } from './api';

export default class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      code: ''
    }
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value })
  }

  handleCodeChange = (e) => {
    this.setState({ code: e.target.value })
  }

  handleStart = async () => {
    if (!this.state.username) {
      return
    }

    const usernameRes = await setUsername(this.state.username)
    if (usernameRes.status !== 200 && usernameRes.status !== 409) {
      console.log(usernameRes.status)
      return // TODO: Display some kind of error
    }

    const player = await usernameRes.json()

    // Initiate a Socket.io connection
    connectSocket()

    if (this.state.code.length === 0) {
      const createRes = await createRoom()
      if (createRes.status === 200) {
        console.log(player)
        this.props.history.push({
          pathname: '/lobby',
          state: {
            players: [player],
            leader: player,
            code: (await createRes.json()).code
          }
        })
      }
    } else {
      const joinRes = await joinRoom(this.state.code)
      console.log(joinRes.status)
      if (joinRes.status === 200) {
        this.props.history.push({
          pathname: '/lobby',
          state: await joinRes.json()
        })
      }
    }
  }

  render() {
    return (
      <div id="home-page" className="page">
        <h1>Welcome to YIKES!</h1>
        <p>What's your name?</p>
        <input placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} />
        <input placeholder="Room Code" value={this.state.code} onChange={this.handleCodeChange} />
        <h5>Leave room code empty for new room!</h5>
        <button onClick={this.handleStart}>Let's go!</button>
      </div>
    );
  }
}
