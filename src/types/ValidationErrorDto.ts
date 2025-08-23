import {ValidationError} from "./ValidationError";

export type ValidationErrorDto = {
    errorMessages: ValidationError[];
}