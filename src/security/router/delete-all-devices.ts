import {Request, Response} from 'express';
import {deviceService} from "../domain/divice-service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../core/types/httpSatuses";

export const deleteAllDevices = async(req:Request, res: Response) => {

    const userId = req.user.id
    const refreshToken = req.refreshToken


    const resultDeleted = await deviceService.deleteAllSession(userId, refreshToken)
    if(resultDeleted.status !== ResultStatus.Success) {
      return  res.status(resultCodeToHttpException(resultDeleted.status)).json(resultDeleted.errorMessage)
    }


    res.sendStatus(HttpStatuses.NoContent_204)



}
