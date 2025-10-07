import {NextFunction, Request, Response} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {jwtService} from "../../adapters/jwt.service";
import {userRepository} from "../../../users/repository/user.repository";


export const refreshTokenGuard = async (req:Request, res:Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)  return res.sendStatus(HttpStatuses.Unauthorized_401)


    const payload = await jwtService.verifyRefreshToken(refreshToken)
    if(!payload) {
       return  res.sendStatus(HttpStatuses.Unauthorized_401)
    }

    const isInBlackList = await userRepository.findOldRefreshToken(refreshToken, payload.userId)
    if(isInBlackList) {
        return res.sendStatus(HttpStatuses.Unauthorized_401)
    }

    req.user = payload.userId
    req.refreshToken = refreshToken


    next()


}