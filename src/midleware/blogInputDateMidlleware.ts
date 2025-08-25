import {body} from "express-validator";

const URL_REGEX = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/


    const nameValidation = body('name')
.isString()
.withMessage('Name should be string')
.trim()
.isLength({min: 1, max: 15})
.withMessage('Length of name is not correct)')

const descriptionValidation = body('description')
.isString()
.withMessage('Description should be string')
.trim()
.isLength({min: 1, max: 500})
.withMessage('Length of description is not correct')

const websiteUrlValidation = body('websiteUrl')
    .isString()
    .withMessage('websiteUrl should be string')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('Length of  websiteUrl is not correct')
    .matches(URL_REGEX)
    .withMessage('websiteUrl not correct')

export const blogInputDtoValidation =[
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
]