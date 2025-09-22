import {RequestWithBody} from "../../core/types/RequestInputType";
import {RegistrationCodConfirmation} from "../dto/RegistrationConfirmaionCodeModel";
import {authService} from "../domain/auth.service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {Response} from "express";
import {HttpStatuses} from "../../core/types/httpSatuses";


export const confirmEmail = async (req:RequestWithBody<RegistrationCodConfirmation>, res: Response) => {

    const result = await authService.confirmEmail(req.body.code)
    if(result.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(result.status))
    }

    return res.sendStatus(HttpStatuses.Created_201)

}