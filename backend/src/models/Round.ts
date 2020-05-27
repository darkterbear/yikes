import Card, { CardType } from './Card';
import Player from './Player';
import Room from './Room';
import Turn from './Turn';

/**
 * A round is a single orbit around the players,
 * where each player becomes the "single" once.
 * This Round class represents the complete state
 * of the game for the duration of a single round.
 */
export default class Round {
  /** The room that this game is in. */
  public room!: Room;

  /** The id of the player that is the judge or "single" for this turn. */
  public singleId!: string;

  /** Represents who's turn it is and what type of card they must play. */
  public turn!: Turn;

  /** The cards that are played by each player so far. */
  public playedCards!: Map<string, Card[]>;

  /** The likes each player has (should be kept to only that player). */
  public likesHands!: Map<string, Card[]>;

  /** The yikes each player has (should be kept to only that player). */
  public yikesHands!: Map<string, Card[]>;

  /** The likes deck used by this round. */
  public likesDeck!: Card[];

  /** The yikes deck used by this round. */
  public yikesDeck!: Card[];

  constructor(room: Room) {
    this.room = room;
    this.singleId = room.players[0].id;
    this.turn = new Turn(room.players[1], CardType.Likes);
    this.playedCards = new Map<string, Card[]>();
    this.likesHands = new Map<string, Card[]>();
    this.yikesHands = new Map<string, Card[]>();
    this.likesDeck = Card.newLikesDeck();
    this.yikesDeck = Card.newYikesDeck();

    Card.shuffle(this.likesDeck);
    Card.shuffle(this.yikesDeck);
    this.dealCards();
  }

  public dealCards() {
    // Assign 4 likes and 3 likes to each player
    for (const player of this.room.players) {
      // Assign likes
      let likesHand: Card[] = [];
      if (this.likesHands.has(player.id)) {
        likesHand = this.likesHands.get(player.id);
      }

      while (likesHand.length < 4) {
        likesHand.push(Card.draw(this.likesDeck));
      }

      this.likesHands.set(player.id, likesHand);

      // Assign yikes
      let yikesHand: Card[] = [];
      if (this.yikesHands.has(player.id)) {
        yikesHand = this.yikesHands.get(player.id);
      }

      while (yikesHand.length < 3) {
        yikesHand.push(Card.draw(this.yikesDeck));
      }

      this.yikesHands.set(player.id, yikesHand);
    }
  }
}
