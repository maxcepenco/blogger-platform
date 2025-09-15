import {RequestWithBody} from "../../../core/types/RequestInputType";
import {LoginDto} from "../../types/login.dto";
import {authService} from "../../domain/auth.service";
import {Response} from "express";
import {ResultStatus} from "../../../core/result/result-code";
import {resultCodeToHttpException} from "../../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../../core/types/httpSatuses";


export const authAccess = async (req:RequestWithBody<LoginDto>, res: Response ) => {
    const { loginOrEmail, password } = req.body;
    const result = await authService.loginUser(loginOrEmail, password);

    if(result.status !== ResultStatus.Success) {
        return res.sendStatus(resultCodeToHttpException(result.status))
    }

    return res.status(HttpStatuses.Ok_200).send({accessToken: result.data!.accessToken})
}