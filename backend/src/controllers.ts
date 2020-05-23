import { Request, Response } from 'express';
import Player from './models/Player';
import Room, { RoomState } from './models/Room';
import Round from './models/Round';
import { sio } from './server';

/** Sets the user's username. */
export const setUsername = (req: Request, res: Response) => {
  const { username } = req.body;
  const player = Player.getPlayer(req.sessionID);

  if (player) {
    // Existing player is setting username; destroy the existing player, leave the room this player is in, etc.
    Player.disconnectPlayer(player.id);
  }

  res.status(200).json(Player.createPlayer(req.sessionID, username));
};

/** Handles room creation. */
export const create = (req: Request, res: Response) => {
  const room = Room.createRoom(req.player);

  // Join this player into the socket room.
  req.player.socket.join(room.code);

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
  res.status(200).json({
    code: room.code, players: room.players.map((p) => p.toShortPlayer()), leader: room.leader.toShortPlayer(),
  });

  // Socket.io notify the other players in this room about this join.
  sio.to(room.code).emit('new-player', req.player.toShortPlayer());

  // Join this player into the socket room.
  req.player.socket.join(room.code);
};

export const startGame = (req: Request, res: Response) => {
  const room = req.player.room;

  room.state = RoomState.INGAME;
  room.round = new Round(room);

  for (const player of room.players) {
    player.socket.emit('round-started', {
      single: room.round.single,
      turn: room.round.turn,
      playedCards: room.round.playedCards,
      likesHand: room.round.likesHands.get(player.id),
      yikesHand: room.round.yikesHands.get(player.id),
    });
  }
};
