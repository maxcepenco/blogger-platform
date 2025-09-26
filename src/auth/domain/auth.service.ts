import {bcryptService} from "../adapters/bcrypt.service";
import {userRepository} from "../../users/repository/user.repository";
import {ResultStatus} from "../../core/result/result-code";
import {WithId} from "mongodb";
import {UserAccountDBType} from "../../users/types-user/UserAccountDBType";
import {Result} from "../../core/result/result-type";
import {jwtService} from "../adapters/jwt.service";
import {UserInputModel} from "../../users/input-model/input-model.user";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add";
import {nodemailerService} from "../adapters/nodemailer.service";
import {emailExamples} from "../adapters/email-example";

export const authService = {

    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise <Result<{accessToken: string} | null>>  {

        const result = await this.checkUserCredentials(loginOrEmail, password)
        if(result.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Unauthorized',
                extensions: [{ field: 'LoginOrEmail', message: 'Wrong credentials'}]

            }
        }
    const accessToken = await jwtService.createToken(result.data!._id.toString())
        return {
            status: ResultStatus.Success,
            data: { accessToken },
            extensions:[]
        }
    },

    async checkUserCredentials( loginOrEmail: string, password: string ):Promise<Result<WithId<UserAccountDBType> | null >> {

        const user = await userRepository.findByLoginOrEmail(loginOrEmail)

        if(!user) {
            return {
                status: ResultStatus.NotFound,
                data:null,
                errorMessage: 'Not Found',
                extensions: [{field: 'loginOrEmail', message: 'Not Found'}]
            }
        }

        const isPassCorrect = await bcryptService.checkPassword(password, user.accountDate.passwordHash)
        if(!isPassCorrect) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{field: 'password', message: 'Wrong password'}]
            }
        }

        return {
            status: ResultStatus.Success,
            data: user,
            extensions: []
        }

        },





    async registerUser(userDto:UserInputModel):Promise<Result<UserAccountDBType | null >> {
        const {login,password,email} = userDto

        const user = await userRepository.findExistByLoginOrEmail(login,email)
        if(user) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{field: 'LoginOrEmail', message: 'Already registered'}]
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
               emailConfirmed:{
                    confirmationCode: randomUUID(),
                     expirationDate: add( new Date(), {
                        hours: 6,
                         minutes: 6,
                     })
               },
               isConfirmed: false,
           }

          await userRepository.create(newUser)

       await nodemailerService
            .sendEmail(
            newUser.accountDate.email,
            newUser.emailConfirmed!.confirmationCode,
            emailExamples.registrationEmail
        )
           .catch(er => console.error('error in send email:', er)) // нужно изучить

    return {
            status: ResultStatus.Success,
            data: newUser,
            extensions: []
    }

    },

    async confirmEmail(code:string):Promise<Result<boolean | null> > {

        const user = await userRepository.findByCode(code)

        if(!user) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'User not found',
                extensions: [{field: 'user', message: 'Not exist'}]

            }
        }

        if(user.isConfirmed ) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'User confirmed',
                extensions: [{field: 'code', message: 'Пользователь уже зарегестрирован'}]
            }
        }

        if(user.emailConfirmed!.confirmationCode !== code) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'code not confirmed',
                extensions: [{field: 'code', message: 'Confirmation code is incorrect'}]
            }
        }

        if(user.emailConfirmed!.expirationDate! < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Expiration code',
                extensions: [{field: ' code', message: 'Confirmation code is expired'}]
            }
        }



        let result = await userRepository.updateUser(user._id)

        return {
            status: ResultStatus.Success,
            data: result,
            extensions: []
        }
    },

    async emailResending(email:string) {

        const foundUser = await userRepository.findByLoginOrEmail(email)
        if(!foundUser) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: ' Not User',
                extensions: [{field: 'email', message: 'User not found'}]
            }
        }
        if(foundUser.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'User isConfirmed',
                extensions: [{field: 'email', message: 'Email is confirmed'}]
            }
        }

        const newCode =  randomUUID();
        const newExpirationDate = add(new Date(), {hours: 6, minutes: 6})

        await userRepository.updateConfirmationData(foundUser._id, newCode, newExpirationDate)


        const resendingCode = await nodemailerService.sendEmail(
            foundUser.accountDate.email,
            newCode,
            emailExamples.registrationEmail
        ).catch(er => console.error('error in send email:', er))


        return {
            status: ResultStatus.Success,
            data: resendingCode,
            extensions: []
        }

    }

}