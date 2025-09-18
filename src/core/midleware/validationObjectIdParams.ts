import {Request,Response,NextFunction} from "express";
import {ObjectId} from "mongodb";
import {HttpStatuses} from "../types/httpSatuses";


export const validationObjectIdParams = (paramName: string = 'id') => {
    return (req: Request, res: Response, next: NextFunction ) => {
        const id = req.params[paramName];
        if(!ObjectId.isValid(id)) {
            return res.sendStatus(HttpStatuses.NotFound_404)
        }
        next()
    }
}