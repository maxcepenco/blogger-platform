import {Request, Response} from "express";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {authService} from "../domain/auth.service";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {ResultStatus} from "../../core/result/result-code";

export const logout = async (req: Request, res: Response) => {
    const userId = req.user
    console.log('logout', userId)
    const refreshToken = req.refreshToken

    if (!refreshToken) {
        console.log(refreshToken)

    }

    res.clearCookie("refreshToken", {
        httpOnly: false,
        secure: false,
    });

    const result = await authService.deleteThisSession(userId, refreshToken)
    console.log(result)
    if(result.status !== ResultStatus.Success)  {
        return  res.sendStatus(resultCodeToHttpException(result.status))
    }
    res.sendStatus(HttpStatuses.NoContent_204)
}