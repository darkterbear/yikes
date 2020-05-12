import { Request, Response } from 'express';
import { rooms } from './server';

/** Handles room creation. */
export const create = (req: Request, res: Response) => {
  console.log(req.sessionID);
  res.status(200).end();
};
