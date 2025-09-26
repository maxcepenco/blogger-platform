import {RequestWithBody} from "../../core/types/RequestInputType";
import {authService} from "../domain/auth.service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {Response} from "express";
import {HttpStatuses} from "../../core/types/httpSatuses";


export const registrationEmailResending = async (req:RequestWithBody<{email:string}>,res: Response) => {
    const email = req.body.email;
    const result = await authService.emailResending(email);
    if(result.status !==ResultStatus.Success) {
       return res.status(resultCodeToHttpException(result.status)).send(result.extensions)
    }

    return res.sendStatus(HttpStatuses.NoContent_204)
}
