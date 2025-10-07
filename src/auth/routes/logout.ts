import {Request,Response} from "express";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {refreshTokenCollection} from "../../db/mongoDB";
import {authService} from "../domain/auth.service";

export const logout = async (req: Request, res: Response) => {
    const userId = req.user
    const refreshToken = req.refreshToken

    if (!refreshToken) {
        res.sendStatus(HttpStatuses.Unauthorized_401)
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });

    const oldToken = await authService.addOlTokenBlackList(userId,refreshToken);

    res.sendStatus(HttpStatuses.NoContent_204)
}