import Game from './Game';
import Player from './Player';

/** Rooms can be in several different states, represented below. */
export enum RoomState {
  WAITING = 'waiting',
  INGAME = 'in_game',
  ROUNDEND = 'round_end',
}

export const CODE_LENGTH = Number(process.env.CODE_LENGTH);

const randomCode = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < CODE_LENGTH; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

/**
 * A room's complete state is, additionally, represented by its
 * players, leader, and the collection of rounds.
 */
export default class Room {
  /** Holds all rooms; map of code to Room object. */
  public static rooms: Map<string, Room> = new Map();

  public static getRoom(code: string) {
    return this.rooms.get(code);
  }

  /** Creates a room and stores it in the application state. */
  public static createRoom(creator: Player) {
    const room = new Room(creator);
    this.rooms.set(room.code, room);
    return room;
  }

  /** Generates a unique room code, 6-digit alphanumeric. */
  public static generateUniqueCode() {
    let code = randomCode();
    while (Room.rooms.has(code)) {
      code = randomCode();
    }
    return code;
  }

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

  /** Constructs a new room. */
  constructor(creator: Player) {
    this.code = Room.generateUniqueCode();
    this.state = RoomState.WAITING;
    this.players = [creator];
    this.leader = creator;
    this.game = null;
  }
}
