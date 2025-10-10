import {NextFunction} from "express";
import {Request, Response} from "express";
import {sessionRepository} from "../../auth/repository/session-repository";

const WINDOW_SIZE = 10 // ОКНО ЗАПРОССОВ
const MAX_COUNT_REQUEST = 5 // лимит запросов

 export async function userRequestRateLimiter(req:Request, res:Response, next:NextFunction) {
    const ip = req.ip || 'unknown'
    const url =  req.originalUrl
    const now = new Date()

    const windowsStart = new Date(now.getTime() - WINDOW_SIZE * 1000)

    const requestCount = await sessionRepository.findRequest(ip, url, windowsStart)

    if(requestCount >= MAX_COUNT_REQUEST ) {
        return res.sendStatus(429)
    }

     await sessionRepository.saveRequest(ip, url, now)

    next()
}