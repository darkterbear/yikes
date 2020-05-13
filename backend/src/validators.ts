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
