import {body} from "express-validator";
import {userQueryRepository} from "../../repository/user.query-repository";
import {userRepository} from "../../repository/user.repository";

export const emailValidation = body('email')
    .isString()
    .withMessage('email must be a string')
    .trim()
    .isLength({min: 1})
    .withMessage('email is required')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('email must match pattern ^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
