import Card from './Card';
import Player from './Player';
import Turn from './Turn';

/**
 * A round is a single orbit around the players,
 * where each player becomes the "single" once.
 * This Round class represents the complete state
 * of the game for the duration of a single round.
 */
export default class Game {
  /** The player that is the judge or "single" for this turn. */
  public single!: Player;

  /** Represents who's turn it is and what type of card they must play. */
  public turn!: Turn;

  /** The cards that are played by each player so far. */
  public playedCards!: Map<string, Card[]>;

  /** The hands of each player (should be kept to only that player). */
  public hands!: Map<string, Card[]>;
}
