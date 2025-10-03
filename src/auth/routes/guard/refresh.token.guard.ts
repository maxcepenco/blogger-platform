import {NextFunction, Request, Response} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {jwtService} from "../../adapters/jwt.service";


export const refreshTokenGuard = async (req:Request, res:Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)  return res.sendStatus(HttpStatuses.Unauthorized_401)


    const payload = await jwtService.verifyToken(refreshToken)
    if(!payload) {
       return  res.sendStatus(HttpStatuses.Unauthorized_401)
    }

    req.user = payload.userId
    req.refreshToken = refreshToken

    next()


}