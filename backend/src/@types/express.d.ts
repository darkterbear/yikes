import Player from "../models/Player";

declare module 'express-serve-static-core' {
  interface Request {
    player?: Player
  }
}