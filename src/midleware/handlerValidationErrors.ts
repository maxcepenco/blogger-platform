import {ValidationErrorDto} from "../types/ValidationErrorDto";
import {ValidationErrorType} from "../types/ValidationError";
import {FieldValidationError, ValidationError, validationResult} from "express-validator";
import {Request,Response,NextFunction} from "express";
import {HttpStatuses} from "../core/httpSatuses";

 export const createErrorMessage = (errors: ValidationErrorType[]): ValidationErrorDto => {
    return {errorMessages: errors}
}

const formatErrors = (error: ValidationError): ValidationErrorType => {
    const expressErrors = error as unknown as FieldValidationError

    return {
        field:expressErrors.path,
        message:expressErrors.msg,
    }
}

export const handlerValidationErrors = (req:Request, res:Response, next: NextFunction) => {
     const errors = validationResult(req)
         .formatWith(formatErrors)
         .array({onlyFirstError: true })

    if( errors.length > 0 ) {
        res.status(HttpStatuses.BadRequest_400).json({errorsMessages:errors})
        return
    }
    next()
}


