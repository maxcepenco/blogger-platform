import {CreateSessionDto} from "../dto/session-DB-type";
import {refreshTokenCollection} from "../../db/mongoDB";
import {DeviceViewModel} from "../../security/dto/device-view-model";

export const sessionRepository = {

    async createSession(newSession: CreateSessionDto):Promise<any> {
        const result = await refreshTokenCollection.insertOne(newSession);
        return result.insertedId.toString()
    },

    async findSession (userId:string, deviceId:string):Promise<CreateSessionDto | null> {
        const session = await refreshTokenCollection.findOne({userId: userId,  deviceId: deviceId});
        if (!session) {
            return null
        }
        return  session
    },

    async findSessionByDeviceId(deviceId:string):Promise<CreateSessionDto | null> {
        console.log('sessionDB',deviceId)
        const session = await refreshTokenCollection.findOne({deviceId: deviceId})
        console.log('session===', session)
        if (!session) {
            return null
        }
        return session
    },

    async deleteUserSession(userId:string, deviceId:string): Promise<boolean> {
      const result =  await refreshTokenCollection.deleteOne({userId: userId,  deviceId: deviceId});

      return result.deletedCount === 1
    },

    async updateSession(deviceId:string, iat: Date, exp:Date): Promise<boolean> {
        const result = await refreshTokenCollection.updateOne(
            { deviceId: deviceId },
            {$set:{
                    iat: iat,
                    exp: exp,
                }})

        return result.modifiedCount === 1
    },



    async findAllSession(userId: string): Promise<DeviceViewModel[]> {
        const sessions = await refreshTokenCollection.find({userId}).toArray();
        return sessions.map(session => this._mapToDevisesViewModel(session));
    },

    async deleteAllSession(userId: string, currentDeviceId:string): Promise<boolean> {
        console.log("user:", userId,"currentDeviceId", currentDeviceId );
        const result = await refreshTokenCollection.deleteMany(
            {
            userId: userId,
            deviceId: {$ne: currentDeviceId},
        }
        );
        return result.deletedCount >= 0
    },

    _mapToDevisesViewModel(session:CreateSessionDto): DeviceViewModel {
        return{
            ip:session.ip,
            title: session.deviceName,
            lastActiveDate: session.iat.toString(),
            deviceId:session.deviceId
        }
    }


}