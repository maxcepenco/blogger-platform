import {Request, Response} from 'express';
import {authService} from "../domain/auth.service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../core/types/httpSatuses";


export const authRefreshToken = async(req: Request, res: Response) => {

    const refreshToken = req.refreshToken;
    console.log(refreshToken );



  const result = await authService.createRefreshAndAccessToken( refreshToken);
  if(result.status !== ResultStatus.Success) {

      return  res.sendStatus(resultCodeToHttpException(result.status))


  }
    res.cookie("refreshToken", result.data!.newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: (7 * 24 * 60 * 60 * 1000) + (10 * 60 * 1000)
    })
  res.status(HttpStatuses.Ok_200).send({accessToken: result.data!.newAccessToken});


}