import { Socket } from 'socket.io';
import Room from './Room';

/** Player represents a single user. */
export default class Player {
  /** Holds all players; map of id to Player object. */
  public static players: Map<string, Player> = new Map();

  public static getPlayer(id: string) {
    return this.players.get(id);
  }

  /** Creates a player and stores it in the application state. */
  public static createPlayer(id: string, username: string) {
    const player = new Player(id, username);
    this.players.set(id, player);
    return player;
  }

  public static destroyPlayer(id: string) {
    const player = this.getPlayer(id);
    if (player.socket) {
      player.socket.disconnect(true);
    }
    this.players.delete(id);
  }

  public static disconnectPlayer(id: string) {
    const player = this.getPlayer(id);
    const room = player.room;
    if (room) {
      // TODO: if room is in-game, <3 players means back to lobby
      // Remove player from room
      room.players.splice(room.players.indexOf(player), 1);
      // Handle room
      if (room.leader === player) {
        if (room.players.length < 1) {
          Room.destroyRoom(room.code);
        } else {
          room.leader = room.players[0];
        }
      }
    }

    // Delete this player
    Player.destroyPlayer(id);
  }

  /** Each user is given a unique ID. */
  public id!: string;

  /** Each user picks a username (not necessarily unique). */
  public username!: string;

  /** Each user has a score. */
  public score!: number;

  /** Room of this player. */
  public room: Room;

  /** This player's socket connection. */
  public socket: Socket;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.score = 0;
    this.room = null;
    this.socket = null;
  }

  public toShortPlayer() {
    return {
      id: this.id,
      username: this.username,
    };
  }
}
