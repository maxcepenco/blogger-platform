import {RequestWithBody, RequestWithUserId} from "../../core/types/RequestInputType";
import {LoginDto} from "../dto/login.dto";
import {parseUserAgent} from "../../core/helpers/parseUserAgent";
import {authService} from "../domain/auth.service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {IdType} from "../../core/types/id-type.user";
import {userQueryRepository} from "../../users/repository/user.query-repository";
import {UserInputModel} from "../../users/input-model/input-model.user";
import {RegistrationCodConfirmation} from "../dto/RegistrationConfirmaionCodeModel";
import {Request, Response} from "express";  // ← Добавьте Request сюда!


class AuthController {

    async authLoginAccess(req: RequestWithBody<LoginDto>, res: Response) {
        const {loginOrEmail, password} = req.body;

        const deviceInfo = parseUserAgent(req.headers['user-agent'] || '') // нужен middleware
        const ip = req.ip || req.socket.remoteAddress || 'unknown';

        const result = await authService.loginUser(loginOrEmail, password, deviceInfo, ip);


        if (result.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(result.status))
        }

        res.cookie("refreshToken", result.data!.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: (7 * 24 * 60 * 60 * 1000) + (10 * 60 * 1000)
        })

        return res.status(HttpStatuses.Ok_200).send({accessToken: result.data!.accessToken})

    }

    async authMeHandler(req: RequestWithUserId<IdType>, res: Response) {
        const userId = req.user as string;
        if (!userId) return res.sendStatus(HttpStatuses.Unauthorized_401)
        const me = await userQueryRepository.findByIdForMe(userId);
        console.log(`AuthMeViewModel: ${me}`);
        return res.status(HttpStatuses.Ok_200).send(me)
    }

    async authRefreshToken(req: Request, res: Response) {

        const userId = req.user
        const deviceId = req.deviceId


        const result = await authService.createRefreshAndAccessToken(userId!, deviceId);
        if (result.status !== ResultStatus.Success) {

            return res.sendStatus(resultCodeToHttpException(result.status))


        }
        res.cookie("refreshToken", result.data!.newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: (7 * 24 * 60 * 60 * 1000) + (10 * 60 * 1000)
        })
        res.status(HttpStatuses.Ok_200).send({accessToken: result.data!.newAccessToken});


    }

    async authRegistration(req: RequestWithBody<UserInputModel>, res: Response) {
        const userData = req.body;
        const result = await authService.registerUser(userData);
        if (result.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(result.status)).send(result.extensions)
        }
        return res.sendStatus(HttpStatuses.NoContent_204)
    }

    async confirmEmail(req: RequestWithBody<RegistrationCodConfirmation>, res: Response) {
        const result = await authService.confirmEmail(req.body.code)

        if (result.status !== ResultStatus.Success) {

            return res.status(resultCodeToHttpException(result.status)).send(result.extensions)
        }

        return res.sendStatus(HttpStatuses.NoContent_204)

    }

    async registrationEmailResending(req: RequestWithBody<{ email: string }>, res: Response) {
        const email = req.body.email;
        const result = await authService.emailResending(email);
        if (result.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(result.status)).send(result.extensions)
        }

        return res.sendStatus(HttpStatuses.NoContent_204)
    }

    async logout(req: Request, res: Response) {
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

        const result = await authService.deleteThisSession(userId!, refreshToken)
        console.log(result)
        if (result.status !== ResultStatus.Success) {
            return res.sendStatus(resultCodeToHttpException(result.status))
        }
        res.sendStatus(HttpStatuses.NoContent_204)
    }

}

export const authController = new AuthController();