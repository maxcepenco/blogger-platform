import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {Request, Response} from "express";
import {RequestWithParams} from "../../core/types/RequestInputType";
import {DeviceService} from "../domain/divice-service";


export class DeviceController {
    constructor(protected deviceService: DeviceService) {
    }

    async deleteAllDevices(req: Request, res: Response) {

        const userId = req.user
        const refreshToken = req.refreshToken

        const resultDeleted = await this.deviceService.deleteAllSession(userId!, refreshToken)
        if (resultDeleted.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(resultDeleted.status)).json(resultDeleted.errorMessage)
        }

        res.sendStatus(HttpStatuses.NoContent_204)

    }

    async deleteDeviceForId(req: RequestWithParams<{ id: string }>, res: Response) {

        const userId = req.user
        const deviceId = req.params.id
        console.log('userId===', userId)
        console.log('deviceId===', deviceId)

        const resultDeletedForId = await this.deviceService.deleteDeviceForId(userId!, deviceId)
        console.log('resultDeletedForId===', resultDeletedForId)
        if (resultDeletedForId.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(resultDeletedForId.status))
        }

        return res.sendStatus(HttpStatuses.NoContent_204)

    }

    async getAllDevices(req: Request, res: Response) {

        const userId = req.user

        const resultGetDevices = await this.deviceService.findAllSession(userId!)

        return res.status(HttpStatuses.Ok_200).json(resultGetDevices.data)
    }

}