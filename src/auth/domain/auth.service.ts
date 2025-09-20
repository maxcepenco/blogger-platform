import {bcryptService} from "../adapters/bcrypt.service";
import {userRepository} from "../../users/repository/user.repository";
import {ResultStatus} from "../../core/result/result-code";
import {WithId} from "mongodb";
import {UserAccountDBType} from "../../users/types-user/UserAccountDBType";
import {Result} from "../../core/result/result-type";
import {jwtService} from "../adapters/jwt.service";


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

        }

}