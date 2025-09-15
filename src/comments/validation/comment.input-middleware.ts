import {body} from "express-validator";


export const commentInputMiddleware = body('content')
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage('content length is required')
