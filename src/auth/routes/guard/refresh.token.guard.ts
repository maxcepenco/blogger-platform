import {NextFunction, Request, Response} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {jwtService} from "../../adapters/jwt.service";
import {sessionRepository} from "../../../composition-root";


export const refreshTokenGuard = async (req:Request, res:Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken)  return res.sendStatus(HttpStatuses.Unauthorized_401)


    const payload = await jwtService.verifyRefreshToken(refreshToken)
    if(!payload) {
       return  res.sendStatus(HttpStatuses.Unauthorized_401)
    }
       //----------------надо обсудить--------------------------------------//
    const {userId,deviceId,iat,} = payload;

    const session = await sessionRepository.findSession(userId,deviceId)
    if(!session) {
        return  res.sendStatus(HttpStatuses.Unauthorized_401)
    }
    const tokenIat = new Date(iat * 1000)
    const sessionIat = session.iat

     // Проверяем если это старый токе
    if(tokenIat.getTime() !== sessionIat.getTime()) {
        return res.sendStatus(HttpStatuses.Unauthorized_401)
    }
    // Проверка если токен не просрочен
    if(session.exp < new Date()){
        return res.sendStatus(HttpStatuses.Unauthorized_401)
    }
    //-----------------------------------------------------------------------//

    req.user = userId

    req.refreshToken = refreshToken

    req.deviceId = deviceId


    next()
}