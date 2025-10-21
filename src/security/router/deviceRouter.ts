import {Router} from "express";
import {refreshTokenGuard} from "../../auth/routes/guard/refresh.token.guard";
import {deviceController} from "../../composition-root";


export const devicesRouter = Router();


 devicesRouter
     .get('/devices',refreshTokenGuard, deviceController.getAllDevices.bind(deviceController))
     .delete('/devices', refreshTokenGuard,deviceController.deleteAllDevices.bind(deviceController))
     .delete('/devices/:id',refreshTokenGuard,deviceController.deleteDeviceForId.bind(deviceController))
