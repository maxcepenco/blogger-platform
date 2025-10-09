import {RequestWithBody} from "../../core/types/RequestInputType";
import {LoginDto} from "../dto/login.dto";
import {authService} from "../domain/auth.service";
import {Response} from "express";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {parseUserAgent} from "../../core/helpers/parseUserAgent";


export const authLoginAccess = async (req:RequestWithBody<LoginDto>, res: Response ) => {
    const { loginOrEmail, password } = req.body;

    const deviceInfo = parseUserAgent(req.headers['user-agent'] || '') // нужен middleware
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    const result = await authService.loginUser(loginOrEmail, password, deviceInfo, ip);


    if(result.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(result.status))
    }

    res.cookie("refreshToken", result.data!.refreshToken, {
        httpOnly: false,
        secure: false,
        maxAge: (7 * 24 * 60 * 60 * 1000) + (10 * 60 * 1000)
    })

    return res.status(HttpStatuses.Ok_200).send({accessToken: result.data!.accessToken})

}