import React from 'react';
import { socket } from './api';

export default class LobbyPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = props.location.state
  }

  componentDidMount() {
    socket.on('new-player', player => {
      this.setState({ players: [...this.state.players, player] })
    })
  }

  render() {
    return (
      <div id="lobby-page" className="page">
        <h1>Lobby</h1>
        <h3>{this.state.code}</h3>
        <ul>
          {this.state.players.map(player => {
            if (player === this.state.leader) {
              return <li key={player.id}><b>{player.username}</b></li>
            } else {
              return <li key={player.id}>{player.username}</li>
            }
          })}
        </ul>
      </div>
    );
  }
}
