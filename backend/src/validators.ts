import { body } from 'express-validator';

export const validateUsername = [
  body('username', 'missing or invalid username')
    .exists()
    .trim()
    .isString()
    .isAlphanumeric()
    .not().isEmpty(),
];
