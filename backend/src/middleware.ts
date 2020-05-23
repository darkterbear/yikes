import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Player from './models/Player';

export const userExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const player = Player.getPlayer(req.sessionID);
  if (player && player.socket) {
    req.player = player;
    next();
  } else {
    res.status(412).end();
  }
};

export const inRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.player.room) {
    next();
  } else {
    res.status(412).end();
  }
};

export const isLeader = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.player.room.leader.id === req.player.id) {
    next();
  } else {
    res.status(401).end();
  }
};

export const validateInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
