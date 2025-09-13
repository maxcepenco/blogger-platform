import {RequestWithBody} from "../../../core/types/RequestInputType";
import {LoginDto} from "../../types/login.dto";
import {authService} from "../../domain/auth.service";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import { Response} from "express";


export const authAccess = async (req:RequestWithBody<LoginDto>, res: Response ) => {
    const { loginOrEmail, password } = req.body;

    const accessToken = await authService.loginUser(loginOrEmail, password);

    if(!accessToken) {

        return res.sendStatus(HttpStatuses.Unauthorized_401)

    }

    return  res.sendStatus(HttpStatuses.NoContent_204)
}