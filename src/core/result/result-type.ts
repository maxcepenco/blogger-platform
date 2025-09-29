import {ResultStatus} from "./result-code";


type ErrorExtensions = {
    errorsMessages: Array<{
        message: string;
        field: string;
    }>;
};


export type Result<T = null> = {
    status: ResultStatus
    errorMessage?: string
    extensions?: ErrorExtensions
    data: T
}