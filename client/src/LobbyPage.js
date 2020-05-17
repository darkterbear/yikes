import React from 'react';
import { socket } from './api';

export default class LobbyPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = props.location.state
  }

  componentDidMount() {
    socket.on('new-player', player => {
      this.setState({ room: { ...this.state.room, players: [...this.state.room.players, player] } })
    })
  }

  render() {
    return (
      <div id="lobby-page" className="page">
        <div className="content">
          <h1>Players in this lobby:</h1>
          <div id="players">
            {
              [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                if (i < this.state.room.players.length) {
                  return <div className="player"><p>{this.state.room.players[i].username}</p></div>
                } else {
                  return <div className="player"><p>&nbsp;</p></div>
                }
              })
            }
          </div>
          <h1 id="room-code">CODE: {this.state.room.code}</h1>
          <h1>How to play:</h1>
          <ul id="rules">
            <li>Hop onto a call with everyone to make it more fun!</li>
            <li>Each player will have a hand of <b>likes</b> and <b>yikes</b></li>
            <li>Each round, one person will be Single™️ and everyone else tries to create the ideal date for them with 2 likes. </li>
            <li>After the likes are played, each player (except the Single™️) sabotages the player on their right with a yikes! Know your audience! </li>
            <li>The Single™️ picks their date among the candidates; the player who created that date wins a point!</li>
          </ul>
          {this.state.player.id === this.state.room.leader.id &&
            <button>Start Game</button>
          }
        </div>
      </div>
    );
  }
}
