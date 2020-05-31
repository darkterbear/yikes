import React from 'react';
import { setUsername, createRoom, joinRoom, connectSocket } from './api';

export default class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      code: '',
      loading: false,
      error: null
    }
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value })
  }

  handleCodeChange = (e) => {
    this.setState({ code: e.target.value.toUpperCase() })
  }

  handleStart = async () => {
    if (!this.state.username || this.state.loading) {
      return
    }

    await new Promise((res, rej) => {
      this.setState({ loading: true }, res)
    })

    const usernameRes = await setUsername(this.state.username)
    if (usernameRes.status !== 200 && usernameRes.status !== 409) {
      this.setState({ loading: false })
      return
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
            room: {
              players: [player],
              leader: player,
              code: (await createRes.json()).code
            },
            player
          }
        })
      }
    } else {
      const joinRes = await joinRoom(this.state.code)
      console.log(joinRes.status)
      if (joinRes.status === 200) {
        this.props.history.push({
          pathname: '/lobby',
          state: {
            room: await joinRes.json(),
            player
          }
        })
      } else {
        this.setState({ loading: false, error: 'Invalid room code', code: '' })
      }
    }
  }

  render() {
    return (
      <div id="home-page" className="page">
        <div className="content">
          <img alt="Yikes Logo" src="https://files.terranceli.com/yikes/yikes.svg" />
          <h1>the only appropriate response to the dates your friends set you up on.</h1>
          <p id="device-notice">For the best experience, play on a larger device :)</p>
          <input placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} />
          <input placeholder="Room Code (if joining game)" value={this.state.code} onChange={this.handleCodeChange} />
          <button className={`light ${this.state.loading ? 'disabled' : ''}`} onClick={this.handleStart}>Let's go!</button>
          {this.state.error && <p>{this.state.error}</p>}
        </div>
      </div>
    );
  }
}
