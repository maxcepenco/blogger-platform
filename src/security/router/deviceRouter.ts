import {Router} from "express";
import {refreshTokenGuard} from "../../auth/routes/guard/refresh.token.guard";
import {getAllDevices} from "./get-all-devices";
import {deleteAllDevices} from "./delete-all-devices";
import {deleteDeviceForId} from "./delete-device-for-Id";


export const devicesRouter = Router();


 devicesRouter
     .get('/devices',refreshTokenGuard,getAllDevices)
     .delete('/devices', refreshTokenGuard,deleteAllDevices)
     .delete('/devices/:id',refreshTokenGuard,deleteDeviceForId)
