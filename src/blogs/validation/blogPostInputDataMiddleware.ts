import {body} from "express-validator";


const titleValidationPost = body('title')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Length title not correct ')

const shortDescriptionValidation = body('shortDescription')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Length shortDescription not correct ')

const contentValidation = body('content')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({min: 1,max: 1000})
    .withMessage('Content length not correct ')



export const BlogPostInputDtoMiddleware = [
    titleValidationPost,
    shortDescriptionValidation,
    contentValidation,
]