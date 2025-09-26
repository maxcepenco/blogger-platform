import {ValidationErrorType} from "./ValidationError";

export const createErrorMessage = (error: ValidationErrorType[]): {errorMessage: ValidationErrorType[] } => {
    return {errorMessage: error}
}