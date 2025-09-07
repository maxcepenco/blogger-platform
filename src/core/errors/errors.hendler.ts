import {RepositoryNotFoundError} from "./response-not-found.error";


export function errorsHandler( error: unknown, res: Response ) {
    if( error instanceof RepositoryNotFoundError) {

    }
}