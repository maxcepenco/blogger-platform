import {Request, Response} from 'express';
import {authService} from "../domain/auth.service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../core/types/httpSatuses";


export const refreshToken = async(req: Request, res: Response) => {

  const userId = req.user;
  const refreshToken = req.refreshToken;

  const result = await authService.createRefreshAndAccessToken(userId, refreshToken);
  if(result.status !== ResultStatus.Success) {
      res.sendStatus(resultCodeToHttpException(result.status));
  }
    res.cookie("refreshToken", result.data!.newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: (7 * 24 * 60 * 60 * 1000) + (10 * 60 * 1000)
    })
  res.status(HttpStatuses.Ok_200).send(result.data!.newAccessToken);


}