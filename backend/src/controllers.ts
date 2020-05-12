import { Request, Response } from 'express';
import Player from './models/Player';
import Room from './models/Room';

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
  const player = req.player;
  const room = Room.createRoom(player);
  res.status(200).json({ code: room.code });
};
