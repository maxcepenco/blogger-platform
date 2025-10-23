import {bcryptService} from "../adapters/bcrypt.service";
import {UserRepository} from "../../users/repository/user.repository";
import {ResultStatus} from "../../core/result/result-code";
import {WithId} from "mongodb";
import {UserAccountDBType} from "../../users/types-user/UserAccountDBType";
import {Result} from "../../core/result/result-type";
import {jwtService} from "../adapters/jwt.service";
import {UserInputModel} from "../../users/routes/input-model/input-model.user";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add";
import {nodemailerService} from "../adapters/nodemailer.service";
import {emailExamples} from "../adapters/email-example";
import {SessionRepository} from "../repository/session-repository";
import {inject, injectable} from "inversify";


@injectable()
export class AuthService {

    constructor(@inject(SessionRepository) protected sessionRepository: SessionRepository,
                @inject(UserRepository) protected userRepository: UserRepository) {
    }

    async loginUser(
        loginOrEmail: string,
        password: string,
        deviceName: string,
        ip: string,
    ): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {

        const result = await this._checkUserCredentials(loginOrEmail, password)
        if (result.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Unauthorized',

            }
        }

        // Генерируем deviceId
        const deviceId = crypto.randomUUID()

        const accessToken = await jwtService.createAccessToken(result.data!._id.toString())
        const refreshToken = await jwtService.createRefreshToken(result.data!._id.toString(), deviceId)

        let decoded = await jwtService.verifyRefreshToken(refreshToken)

        const newSession = {
            userId: result.data!._id.toString(),
            deviceId: deviceId,
            iat: new Date(decoded!.iat * 1000),
            deviceName: deviceName,
            ip: ip,
            exp: new Date(decoded!.exp * 1000),

        }

        await this.sessionRepository.createSession(newSession);


        return {
            status: ResultStatus.Success,
            data: {accessToken, refreshToken},
        }
    }


    async createRefreshAndAccessToken(userId: string, deviceId: string):
        Promise<Result<{ newAccessToken: string, newRefreshToken: string } | null>> {


        let newAccessToken = await jwtService.createAccessToken(userId.toString())

        let newRefreshToken = await jwtService.createRefreshToken(userId.toString(), deviceId)

        // Достаем новые даты
        let iatAndExp = await jwtService.verifyRefreshToken(newRefreshToken)

        const newIat = new Date(iatAndExp!.iat * 1000)
        const newExp = new Date(iatAndExp!.exp * 1000)

        // Обновляем даты
        await this.sessionRepository.updateSession(deviceId, newIat, newExp)


        return {
            status: ResultStatus.Success,
            data: {newAccessToken, newRefreshToken},
        }
    }

    async deleteThisSession(userId: string, refreshToken: string): Promise<Result<boolean | null>> {
        let decoded = await jwtService.verifyRefreshToken(refreshToken)

        if (!decoded) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Refresh token failed',
            }
        }
        // Достаем сессию по userId и deviceId из базы
        await this.sessionRepository.findSession(decoded.userId, decoded.deviceId)

        const result = await this.sessionRepository.deleteUserSession(decoded.userId, decoded.deviceId)
        if (!result) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Session not found',
            }
        }

        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async registerUser(userDto: UserInputModel): Promise<Result<UserAccountDBType | null>> {
        const {login, password, email} = userDto

        const existingUser = await this.userRepository.findExistByLoginOrEmail(login, email);

        if (existingUser) {
            if (existingUser.accountDate.login === login) {
                return {
                    status: ResultStatus.BadRequest,
                    data: null,
                    errorMessage: 'Bad Request',
                    extensions: {
                        errorsMessages: [{message: 'User with this login already exists', field: 'login'}]
                    }
                }
            }

            if (existingUser.accountDate.email === email) {
                return {
                    status: ResultStatus.BadRequest,
                    data: null,
                    errorMessage: 'Bad Request',
                    extensions: {errorsMessages: [{message: 'User with this email already exists', field: 'email'}]}
                }
            }
        }

        const passwordHash = await bcryptService.generateHash(password)

        const newUser: UserAccountDBType = {
            accountDate: {
                login,
                email,
                passwordHash,
                createdAt: new Date(),
            },
            emailConfirmed: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 6,
                    minutes: 6,
                })
            },
            isConfirmed: false,
        }

        await this.userRepository.create(newUser)

        try {
            await nodemailerService.sendEmail(
                newUser.accountDate.email,
                newUser.emailConfirmed!.confirmationCode,
                emailExamples.registrationEmail
            )
        } catch (error) {
            console.error('Error sending confirmation email:', error)
        }


        return {
            status: ResultStatus.Success,
            data: newUser,
        }

    }

    async confirmEmail(code: string): Promise<Result<boolean | null>> {

        const user = await this.userRepository.findByCode(code)
        console.log(`user:${user}`)
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'User not found',
                extensions: {
                    errorsMessages: [{
                        field: 'code',
                        message: 'Confirmation code not found'
                    }]
                }

            }
        }

        if (user.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'User confirmed',
                extensions: {
                    errorsMessages: [{
                        field: 'code',
                        message: 'Email is already confirmed'
                    }]
                }
            }
        }

        if (user.emailConfirmed!.confirmationCode !== code) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'code not confirmed',
                extensions: {
                    errorsMessages: [{
                        field: 'code',
                        message: 'Confirmation code is incorrect'
                    }]
                }
            }
        }

        if (user.emailConfirmed!.expirationDate! < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Expiration code',
                extensions: {
                    errorsMessages: [{
                        field: 'code',
                        message: 'Confirmation code has expired'
                    }]
                }
            }
        }


        let result = await this.userRepository.updateUser(user._id)

        return {
            status: ResultStatus.Success,
            data: result,
        }
    }

    async createRecoveryCode(email: string): Promise<Result<boolean | null>> {

        const user = await this.userRepository.findByLoginOrEmail(email)
        if (!user) {
            return {
                status: ResultStatus.Success,
                data: null,
                errorMessage: 'Not Found',
            }
        }
        const newCode = randomUUID();
        const newExpirationDate = add(new Date(), {hours: 6})

        await this.userRepository.updatePasswordRecoveryCode(user._id, newCode, newExpirationDate)

        const sendEmail = await nodemailerService.sendEmail(
            email,
            newCode,
            emailExamples.passwordRecoveryEmail
        ).catch(er => console.error('error in send email:', er))

        return {
            status: ResultStatus.Success,
            data: sendEmail || null,
        }

    }

    async createNewPassword(password: string, recoveryCode: string): Promise<Result<boolean | null>> {


        const foundUser = await this.userRepository.findByRecoveryCode(recoveryCode)
        if (!foundUser) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Not Found User',
            }
        }

        if(foundUser.passwordRecovery!.expirationDate!  < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Recovery code has expired',
            }
        }

        const newPassword = await bcryptService.generateHash(password)

        const updatedPassword = await this.userRepository.updateUserPassword(foundUser._id, newPassword)

        return {
            status: ResultStatus.Success,
            data: updatedPassword,
        }
    }

    async emailResending(email: string): Promise<Result<boolean | null>> {

        const foundUser = await this.userRepository.findByLoginOrEmail(email)
        console.log('found user:', foundUser)
        if (!foundUser) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: ' Not User',
                extensions: {errorsMessages: [{message: 'User not found', field: 'email'}]}
            }
        }
        if (foundUser.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'User isConfirmed',
                extensions: {
                    errorsMessages: [{
                        field: 'email',
                        message: 'Email is already confirmed'
                    }]
                }
            }
        }

        const newCode = randomUUID();
        const newExpirationDate = add(new Date(), {hours: 6, minutes: 6})

        await this.userRepository.updateConfirmationData(foundUser._id, newCode, newExpirationDate)


        const resendingCode = await nodemailerService.sendEmail(
            foundUser.accountDate.email,
            newCode,
            emailExamples.registrationEmail
        ).catch(er => console.error('error in send email:', er))


        return {
            status: ResultStatus.Success,
            data: resendingCode || null,
        }

    }

    async _checkUserCredentials(loginOrEmail: string, password: string):
        Promise<Result<WithId<UserAccountDBType> | null>> {

        const user = await this.userRepository.findByLoginOrEmail(loginOrEmail)

        if (!user) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not Found',
                // extensions: {errorsMessages:[{message: 'NotFound',field: 'loginOrEmail' }]}
            }
        }

        const isPassCorrect = await bcryptService.checkPassword(password, user.accountDate.passwordHash)
        if (!isPassCorrect) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: {errorsMessages: [{message: 'Wrong password', field: 'password'}]}
            }
        }

        return {
            status: ResultStatus.Success,
            data: user,
        }

    }

}

