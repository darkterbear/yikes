import React from 'react';
import { socket } from './api';

export default class GamePage extends React.Component {

  getPlayedLikes = (playerId) => {
    const cards = this.state.game.playedCards.get(playerId)
    if (cards.length === 0) {
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
    const cards = this.state.game.playedCards.get(leftPlayerId)

    if (cards.length === 3) {
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
     *    game: {
     *      singleId: string (id),
     *      turn: Turn,
     *      playedCards: Map<string (id), Card[]>,
     *      likesHand: Card[],
     *      yikesHand: Card[]
     *    }
     * }
     */

    // Reorder state.players based on this player's position
    let index = 0;
    while (this.state.players[index].id !== this.state.player.id) index++
    this.setState({
      players: this.state.players.slice(index + 1, this.state.players.length).concat(this.state.players.slice(0, index))
    })
  }

  componentDidMount() {
    // socket.on('new-player', player => {
    //   this.setState({ room: { ...this.state.room, players: [...this.state.room.players, player] } })
    // })
  }

  componentWillUnmount() {
    // socket.on('new-player', () => { })
  }

  render() {
    return (
      <div id="game-page" className="page">
        {this.state.players.map((p, i) =>
          <Player
            isSingle={p.id === this.state.game.singleId}
            isTurn={p.id === this.state.game.turn.player.id}
            likes={this.getPlayedLikes(p)}
            yikes={this.getReceivedYikes(i)}
          />
        )}
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
          <h1>Single™️</h1> :
          <div>
            {this.props.likes.map(likeCard => <Card card={likeCard} yikes={false} />)}
            <Card card={this.props.yikes} yikes={true} />
          </div>
        }
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
