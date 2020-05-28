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

  isSingle = () => {
    return this.state.singleId === this.state.player.id
  }

  isTurn = () => {
    return this.state.turn.player.id === this.state.player.id
  }

  getSinglePlayer = () => {
    return this.state.players.filter(p => p.id === this.state.singleId)[0]
  }

  getPlayableCards = () => {
    if (!this.isTurn()) return []

    if (this.state.turn.type === 'likes') {
      return this.state.likesHand
    } else {
      return this.state.yikesHand
    }
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
    console.log(this.state)
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
        <div className="right-players">
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
        <div className="player-pane">
          {/* Can be in one of a few states:
              1. Player is single and it is their turn
                Present a selection for which player wins
              2. Player is single and it is not their turn
                "You're the Single(TM)! It is _____'s turn"
              3. Player is not single and it is their turn
                Present a selection of cards to play
              4. Player is not single and it is not their turn
                "_____ is the Single(TM)! It is _____'s turn"
            */}
          {this.isSingle() && this.isTurn() &&
            <div>
              <h1>Choose who wins!</h1>
              {this.state.players.map(p => <button>{p.username}</button>)}
            </div>
          }
          {this.isSingle() && !this.isTurn() &&
            <div>
              <h1>You're the Single<span role="img" aria-label="TM">™️</span>! It's {this.state.turn.player.username}'s turn</h1>
            </div>
          }
          {!this.isSingle() && this.isTurn() &&
            <div>
              <div className="card-container">{this.getPlayableCards().map(c => <Card card={c} type={c.type} />)}</div>
              <h1>It's your turn!</h1>
            </div>
          }
          {!this.isSingle() && !this.isTurn() &&
            <div>
              <h1>{this.getSinglePlayer().username} is the Single<span role="img" aria-label="TM">™️</span>! It's {this.state.turn.player.username}'s turn</h1>
            </div>
          }
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
          <h1 className={this.props.isTurn ? 'turn' : ''}>Single<span role="img" aria-label="TM">™️</span></h1> :
          <div className={`card-container ${this.props.isTurn ? 'turn' : ''}`}>
            {this.props.likes.map(likeCard => <Card card={likeCard} type="likes" />)}
            <Card card={this.props.yikes} type="yikes" />
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
 *    },
 *    type: string
 * }
 */
class Card extends React.Component {
  render() {
    if (this.props.card) {
      return <div className={`card ${this.props.card.type === 'yikes' ? 'red' : ''}`}>
        <p style={{ fontSize: '11px' }}>{this.props.card.text}</p>
      </div>
    } else {
      return <div className={`card hidden`}>
        <p></p>
      </div>
    }
  }
}
