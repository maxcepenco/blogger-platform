import {Response} from "express";
import {RequestWithParams} from "../../core/types/RequestInputType";
import {deviceService} from "../domain/divice-service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../core/types/httpSatuses";

export const deleteDeviceForId  = async (req:RequestWithParams<{id:string}>, res: Response) => {

const userId = req.user
const deviceId = req.params.id
    console.log('userId===', userId)
    console.log('deviceId===', deviceId)

    const resultDeletedForId = await deviceService.deleteDeviceForId(userId!, deviceId)
    console.log('resultDeletedForId===', resultDeletedForId)
    if(resultDeletedForId.status !== ResultStatus.Success) {
       return  res.sendStatus(resultCodeToHttpException(resultDeletedForId.status))
    }

    return res.sendStatus(HttpStatuses.NoContent_204)

}