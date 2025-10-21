import {body} from "express-validator";
import {blogRepository} from "../../composition-root";


const titleValidation = body('title')
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

const blogIdValidation = body('blogId')
    .isString()
    .withMessage('Blog must be a string')
    .trim()
    .notEmpty()
    .withMessage("BlogId is required")
    .bail()
    .custom(async (value) => {
        const blog = await blogRepository.findById(value)
        if (!blog) {
            throw new Error('Blog with given id does not exist')
        }
        return true
    })

export const postInputDtoMiddleware = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
]