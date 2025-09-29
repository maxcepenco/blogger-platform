import {body} from "express-validator";

export const emailValidation = body('email')
    .isString()
    .withMessage('email must be a string')
    .trim()
    .isLength({min: 1})
    .withMessage('email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('email must match pattern /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/')
