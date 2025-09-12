import {RequestWithParams} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel";
import {userService} from "../../application/user-service";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import { Response} from "express";


export const deleteUser = (req:RequestWithParams<UriParamsInputDto>,res:Response) => {
    const isDeleted = userService.deleteUser(req.params.id);
    if(!isDeleted) {
        res.sendStatus(HttpStatuses.NotFound_404);
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}
