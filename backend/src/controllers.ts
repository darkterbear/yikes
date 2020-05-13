import { Request, Response } from 'express';
import Player from './models/Player';
import Room, { RoomState } from './models/Room';
import { sio } from './server';

/** Sets the user's username. */
export const setUsername = (req: Request, res: Response) => {
  const { username } = req.body;
  const player = Player.getPlayer(req.sessionID);

  if (player) {
    return res.status(409).end();
  } else {
    Player.createPlayer(req.sessionID, username);
  }

  res.status(204).end();
};

/** Handles room creation. */
export const create = (req: Request, res: Response) => {
  const room = Room.createRoom(req.player);
  res.status(200).json({ code: room.code });
};

export const joinRoom = (req: Request, res: Response) => {
  const { code } = req.body;
  const room = Room.getRoom(code);

  // If room doesn't exist or is already in game, 401
  if (!room || room.state !== RoomState.WAITING) {
    return res.status(401).end();
  }

  room.players.push(req.player);
  res.status(200).json({ code: room.code, players: room.players });

  // Socket.io notify the other players in this room about this join.
  sio.to(room.code).emit('new-player', req.player.username);

  // Join this player into the socket room.
  req.player.socket.join(room.code);
};
