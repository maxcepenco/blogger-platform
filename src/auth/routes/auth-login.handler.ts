import {RequestWithBody} from "../../core/types/RequestInputType";
import {LoginDto} from "../dto/login.dto";
import {authService} from "../domain/auth.service";
import {Response} from "express";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../core/types/httpSatuses";


export const authLoginAccess = async (req:RequestWithBody<LoginDto>, res: Response ) => {
    const { loginOrEmail, password } = req.body;
    const result = await authService.loginUser(loginOrEmail, password);

    if(result.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(result.status))
    }

    res.cookie("refreshToken", result.data!.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: (7 * 24 * 60 * 60 * 1000) + (10 * 60 * 1000)
    })

    return res.status(HttpStatuses.Ok_200).send({accessToken: result.data!.accessToken})

}