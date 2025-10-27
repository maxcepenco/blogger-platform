import {NextFunction,Request,Response} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {jwtService} from "../../adapters/jwt.service";
import {IdType} from "../../../core/types/id-type.user";


export const accessTokenGuard = async (req:Request, res:Response, next: NextFunction) => {
    if(!req.headers.authorization)  return res.sendStatus(HttpStatuses.Unauthorized_401)
    console.log(req.headers.authorization);
    const [authType, token] = req.headers.authorization.split(' ')

    if(authType !== 'Bearer') return res.sendStatus(HttpStatuses.Unauthorized_401)

    const payload = await jwtService.verifyAccessToken(token)
    console.log(payload)
    if(!payload) {
       return  res.sendStatus(HttpStatuses.Unauthorized_401)


    }
    const {userId} = payload;

    req.user = userId

    next()

}