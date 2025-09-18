import {ValidationErrorType} from "./ValidationError";

export type ValidationErrorDto = {
    errorMessages: ValidationErrorType[];
}