import {body} from "express-validator";

export const newPasswordValidation = body('newPassword')
    .isString()
    .withMessage('password must be a string')
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage('password must be between 6 and 20 characters');