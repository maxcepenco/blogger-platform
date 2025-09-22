import { body } from "express-validator";

export const codeValidation = body('code')
    .exists().withMessage('code is required')
    .isString().withMessage('code must be a string')
    .trim()
    .isUUID(4).withMessage('Code must be a valid UUID v4');
