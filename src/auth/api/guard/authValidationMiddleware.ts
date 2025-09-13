import {NextFunction} from "express";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Request, Response} from "express";


export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty'

export const authValidationMiddleware = ( req:Request, res:Response, next:NextFunction ) => {
    console.log('🔵 [MIDDLEWARE] Auth middleware called for:', req.method, req.path); // ← ДОБАВИТЬ

    const  authHeader = req.headers['authorization'] as string;
    if( !authHeader ) {
        console.log('🔴 [MIDDLEWARE] No auth header - blocking request'); // ← ДОБАВИТЬ

        res.sendStatus(HttpStatuses.Unauthorized_401)
        return
    }

    const [authType, token] = authHeader.split(' '); //admin:qwerty

    if (authType !== 'Basic') {
        res.sendStatus(HttpStatuses.Unauthorized_401);
        return;
    }

    const credentials = Buffer.from(token, 'base64').toString('utf-8');

    const [username, password] = credentials.split(':');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.sendStatus(HttpStatuses.Unauthorized_401);
        return;
    }

    next();

}