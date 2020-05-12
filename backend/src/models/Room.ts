import Game from './Game';
import Player from './Player';

/** Rooms can be in several different states, represented below. */
export enum RoomState {
  WAITING = 'waiting',
  INGAME = 'in_game',
  ROUNDEND = 'round_end',
}

/**
 * A room's complete state is, additionally, represented by its
 * players, leader, and the collection of rounds.
 */
export default class Room {
  /** Holds all rooms; map of code to Room object. */
  public static rooms: Map<string, Room> = new Map();

  /** Unique code to join the room. */
  public code!: string;

  /** General room state, as described by above enum. */
  public state!: RoomState;

  /** List of players in the room. */
  public players!: Player[];

  /** Leader of the room, dictates when rounds start. */
  public leader!: Player;

  /** The current game being played. */
  public game!: Game;
}
