import {RequestWithBody} from "../../core/types/RequestInputType";
import {UserInputModel} from "../../users/input-model/input-model.user";
import {authService} from "../domain/auth.service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {Response} from "express";
import {HttpStatuses} from "../../core/types/httpSatuses";


export const authRegistration = async (req:RequestWithBody<UserInputModel>, res:Response) => {
    const userData = req.body;
    const result = await authService.registerUser(userData);
    if(result.status !== ResultStatus.Success) {
       return  res.status(resultCodeToHttpException(result.status))
    }
    return res.sendStatus(HttpStatuses.Created_201)
}