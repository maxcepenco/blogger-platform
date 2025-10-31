import { param } from 'express-validator';

export const commentIdValidation = param('commentId')
    .trim()
    .isString()
    .withMessage('ID must be a string');