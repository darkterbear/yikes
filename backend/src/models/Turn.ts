import { CardType } from './Card';
import Player from './Player';

/**
 * Turn represents part of the state of the game of
 * whose turn it is and what card they must play.
 */
export default class Turn {
  /** Player whose turn it is. */
  public player!: Player;

  /** The type of card they must play. */
  public type!: CardType;

  constructor(player: Player, type: CardType) {
    this.player = player;
    this.type = type;
  }
}
