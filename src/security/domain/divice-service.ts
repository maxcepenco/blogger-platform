import {DeviceViewModel} from "../dto/device-view-model";
import {Result} from "../../core/result/result-type";
import {SessionRepository} from "../../auth/repository/session-repository";
import {ResultStatus} from "../../core/result/result-code";
import {jwtService} from "../../auth/adapters/jwt.service";
import {inject, injectable} from "inversify";

@injectable()
export class DeviceService {
    constructor(@inject(SessionRepository)protected sessionRepository: SessionRepository) {
    }
    async findAllSession(userId:string):Promise<Result<DeviceViewModel[]>> {
        const allSession = await this.sessionRepository.findAllSession(userId)
        return {
            status:ResultStatus.Success,
            data: allSession
        }
    }

    async deleteAllSession(userId:string, refreshToken:string):Promise<Result<boolean | null>> {

        const currentDevices = await jwtService.verifyRefreshToken( refreshToken)
        if(!currentDevices) {
            return {
                status:ResultStatus.Unauthorized,
                data: null,
                errorMessage: "No payload"
            }
        }

        const deleteSession = await this.sessionRepository.deleteAllSession(userId, currentDevices.deviceId)

        if(!deleteSession) {
            return{
                status:ResultStatus.Unauthorized,
                data: null,
                errorMessage: "No session found"
            }
        }

        return {
            status: ResultStatus.Success,
            data: deleteSession,
        }

    }

    async deleteDeviceForId(userId:string, deviceId: string):Promise<Result<boolean | null>> {

        const device = await this.sessionRepository.findSessionByDeviceId(deviceId)
        console.log('device===', device)
        if(!device) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not found'
            }
        }

        if(device.userId !== userId) {
            return {
                status:ResultStatus.Forbidden,
                data: null,
                errorMessage: "You don't have that user"
            }
        }

        const resultDeleted = await this.sessionRepository.deleteUserSession(userId,deviceId)

        return {
            status: ResultStatus.Success,
            data: resultDeleted,
        }

    }
}