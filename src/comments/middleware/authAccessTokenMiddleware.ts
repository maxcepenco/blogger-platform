import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../auth/adapters/jwt.service";

export const authenticateUser = async (req:Request, res:Response, next: NextFunction) => {
    if(!req.headers.authorization)  return next()

    const token = req.headers.authorization?.split(' ')[1];


    const payload = await jwtService.verifyAccessToken(token)
    if(!payload) {
        return next()
    }
    const {userId} = payload;

    req.user = userId

    next()

}