import {NextFunction, Request, Response} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {jwtService} from "../../adapters/jwt.service";
import {IdType} from "../../../core/types/id-type.user";


export const refreshTokenGuard = async (req:Request, res:Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)  return res.sendStatus(HttpStatuses.Unauthorized_401)


    const payload = await jwtService.verifyRefreshToken(refreshToken)
    console.log('payload---',payload)
    if(!payload) {
       return  res.sendStatus(HttpStatuses.Unauthorized_401)
    }

    const {userId} = payload;

    req.user = {id: userId} as IdType

    req.refreshToken = refreshToken


    next()


}