import {param} from 'express-validator';

export const blogIdValidation = param('blogId')
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isMongoId()
    .withMessage('Incorrect format of ObjectId')
