import {RequestWithParams} from "../../../core/types/RequestInputType";
import {idType} from "../../../core/types/InputIUriParamsModel";
import {userService} from "../../domain/user-service";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import { Response} from "express";


export const deleteUser = async (req:RequestWithParams<idType>, res:Response) => {
    const isDeleted = await userService.deleteUser(req.params.id);
    if(!isDeleted) {
        res.sendStatus(HttpStatuses.NotFound_404);
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}
