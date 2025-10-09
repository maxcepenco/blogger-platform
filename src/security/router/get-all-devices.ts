import {Request, Response} from 'express';
import {deviceService} from "../domain/divice-service";
import {HttpStatuses} from "../../core/types/httpSatuses";

 export const getAllDevices = async( req:Request, res: Response ) => {

   const  userId = req.user.id

    const resultGetDevices = await deviceService.findAllSession(userId)

     return res.status(HttpStatuses.Ok_200).json(resultGetDevices.data)
}