import React from 'react';
import { socket } from './api';

export default class GamePage extends React.Component {

  getPlayedLikes = (playerId) => {
    const cards = this.state.playedCards[playerId]
    if (!cards || cards.length === 0) {
      return [null, null] // TODO: use env vars to make this more flexible
    } else if (cards.length === 3) {
      return cards.slice(0, 2)
    }

    return cards
  }

  getReceivedYikes = (index) => {
    // Get the playerId of the player before this index
    index--
    if (index < 0) {
      index = this.state.players.length - 1
    }

    const leftPlayerId = this.state.players[index].id
    const cards = this.state.playedCards[leftPlayerId]

    if (cards && cards.length === 3) {
      return cards[2]
    }

    return null
  }

  constructor(props) {
    super(props)

    this.state = props.location.state
    /**
     * state: {
     *    player: Player,
     *    players: Player[],
     *    singleId: string (id),
     *    turn: Turn,
     *    playedCards: Map<string (id), Card[]>,
     *    likesHand: Card[],
     *    yikesHand: Card[]
     * }
     */
  }

  componentDidMount() {
    // socket.on('new-player', player => {
    //   this.setState({ room: { ...this.state.room, players: [...this.state.room.players, player] } })
    // })

    // Reorder state.players based on this player's position
    let index = 0;
    while (this.state.players[index].id !== this.state.player.id) index++
    this.setState({
      players: this.state.players.slice(index + 1, this.state.players.length).concat(this.state.players.slice(0, index))
    })
  }

  componentWillUnmount() {
    // socket.on('new-player', () => { })
  }

  render() {
    return (
      <div id="game-page" className="page">
        <div className="left-players">
          {this.state.players.slice(0, 2).map((p, i) =>
            <Player
              username={p.username}
              isSingle={p.id === this.state.singleId}
              isTurn={p.id === this.state.turn.player.id}
              likes={this.getPlayedLikes(p)}
              yikes={this.getReceivedYikes(i)}
            />
          )}
        </div>
        <div className="top-players">
          {this.state.players.slice(2, 5).map((p, i) =>
            <Player
              username={p.username}
              isSingle={p.id === this.state.singleId}
              isTurn={p.id === this.state.turn.player.id}
              likes={this.getPlayedLikes(p)}
              yikes={this.getReceivedYikes(i + 2)}
            />
          )}
        </div>
        <div className="top-players">
          {this.state.players.slice(5, 8).map((p, i) =>
            <Player
              username={p.username}
              isSingle={p.id === this.state.singleId}
              isTurn={p.id === this.state.turn.player.id}
              likes={this.getPlayedLikes(p)}
              yikes={this.getReceivedYikes(i + 5)}
            />
          )}
        </div>
      </div>
    );
  }
}

/**
 * Player props: {
 *    isSingle: true | false,
 *    isTurn: true | false,
 *    likes: [null, null],
 *    yikes: null
 * }
 */
class Player extends React.Component {
  render() {
    return (
      <div className={`player ${this.props.isTurn ? 'turn' : ''}`}>
        {this.props.isSingle ?
          <h1 className={this.props.isTurn ? 'turn' : ''}>Single™️</h1> :
          <div className={`card-container ${this.props.isTurn ? 'turn' : ''}`}>
            {this.props.likes.map(likeCard => <Card card={likeCard} yikes={false} />)}
            <Card card={this.props.yikes} yikes={true} />
          </div>
        }
        <h3>{this.props.username}</h3>
      </div>
    );
  }
}

/**
 * Card props: {
 *    card: {
 *      text: string,
 *      filledText: string[]
 *    }
 * }
 */
class Card extends React.Component {
  render() {
    return <div className={`card ${this.props.yikes ? 'red' : ''}`}>
      <p>{this.props.text}</p>
    </div>
  }
}
