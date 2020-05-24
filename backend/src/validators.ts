import { body } from 'express-validator';
import { CODE_LENGTH } from './models/Room';

export const validateUsername = [
  body('username', 'missing or invalid username')
    .exists()
    .trim()
    .isString()
    .isAlphanumeric()
    .not().isEmpty(),
];

export const validateJoin = [
  body('code', 'missing or invalid room code')
    .exists()
    .trim()
    .isString()
    .isAlphanumeric()
    .isLength({ min: CODE_LENGTH, max: CODE_LENGTH }),
];

export const validatePlayCard = [
  body('index', 'missing or invalid card index')
    .exists()
    .trim()
    .isArray()
    .custom((arr) => {
      // Checks if all entries are numeric
      for (const i of arr) {
        if (isNaN(i)) {
          return false;
        }
      }
      return true;
    }),
];

export const validateSelectWinner = [
  body('id', 'missing or invalid id')
    .exists()
    .trim()
    .isString(),
];
