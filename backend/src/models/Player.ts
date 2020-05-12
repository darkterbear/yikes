import Room from './Room';

/** Player represents a single user. */
export default class Player {
  /** Holds all players; map of id to Player object. */
  public static players: Map<string, Player> = new Map();

  /** Each user is given a unique ID. */
  public id!: string;

  /** Each user picks a username (not necessarily unique). */
  public username!: string;

  /** Each user has a score. */
  public score!: number;

  /** Room of this player. */
  public room: Room;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.score = 0;
    this.room = null;
  }
}
