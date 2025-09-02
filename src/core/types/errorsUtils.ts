import {ValidationErrorType} from "../../types/ValidationError";

export const createErrorMessage = (error: ValidationErrorType[]): {errorMessage: ValidationErrorType[] } => {
    return {errorMessage: error}
}