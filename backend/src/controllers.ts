import { Request, Response } from 'express';
import Card, { CardType } from './models/Card';
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

  if (room.players.length >= 8) {
    return res.status(403).end();
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

  if (room.players.length < 3) {
    return res.status(400).end();
  }

  room.state = RoomState.INGAME;
  room.round = new Round(room);

  for (const player of room.players) {
    player.socket.emit('round-started', {
      single: room.round.singleId,
      turn: room.round.turn,
      playedCards: room.round.playedCards,
      likesHand: room.round.likesHands.get(player.id),
      yikesHand: room.round.yikesHands.get(player.id),
    });
  }
};

export const playCard = (req: Request, res: Response) => {
  const room = req.player.room;
  const round = room.round;
  const turn = round.turn;
  let indices: number[] = req.body.indices.map(Number);
  indices = indices.sort((a, b) => b - a);

  // Check that it is the user's turn, which must be non-null
  if (turn.player.id !== req.player.id || turn.type === null) {
    return res.status(403).end();
  }

  // Check card indices in bound
  const hand = turn.type === CardType.Likes ?
    round.likesHands.get(req.player.id) :
    round.yikesHands.get(req.player.id);

  for (const index of indices) {
    if (index < 0 || index > hand.length) {
      return res.status(404).end();
    }
  }

  // Check correct number of cards
  if ((turn.type === CardType.Likes && indices.length !== Card.likesPerPlayer) ||
    (turn.type === CardType.Yikes && indices.length !== Card.yikesPerPlayer)) {
    return res.status(400).end();
  }

  // Place cards in playedCards, update hand and turn
  const playerPlayedCards = round.playedCards.get(req.player.id);
  for (const index of indices) {
    // Splicing is okay since indices are sorted descending
    playerPlayedCards.push(hand.splice(index, 1)[0]);
  }

  const playerIndex = room.players.indexOf(req.player);
  let nextPlayerIndex = (playerIndex + 1) % room.players.length;
  if (room.players[nextPlayerIndex].id === round.singleId) {
    nextPlayerIndex = (nextPlayerIndex + 1) % room.players.length;
  }

  // Check if the next player already played 2 likes 1 yikes
  const nextPlayerPlayedCards = round.playedCards.get(room.players[nextPlayerIndex].id);
  if (nextPlayerPlayedCards.length === Card.likesPerPlayer + Card.yikesPerPlayer) {
    // Single's turn to pick
    turn.player = Player.getPlayer(round.singleId);
    turn.type = null;
  } else {
    turn.player = room.players[nextPlayerIndex];
    turn.type = nextPlayerPlayedCards.length === 0 ? CardType.Likes : CardType.Yikes;
  }

  // Emit to room
  sio.to(room.code).emit('game-update', {
    turn: room.round.turn,
    playedCards: room.round.playedCards,
  });
};
