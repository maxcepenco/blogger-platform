import bcrypt from "bcrypt";
import {bcryptService} from "../adapters/bcrypt.service";
import {userRepository} from "../../users/repository/user-repository";


export const authService = {

    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise< {accessToken: string} | null>  {

        const isCorrectCredentials = await this.checkUserCredentials(
            loginOrEmail,
            password,
        )

        if(!isCorrectCredentials) {

            return null
        }

        return { accessToken: 'token'}
    },
    async checkUserCredentials( loginOrEmail: string, password: string ):Promise< boolean > {

        const user = await userRepository.findByLoginOrEmail(loginOrEmail)

        if(!user) return false

        const result =await bcryptService.checkPassword(password, user.passwordHash)
        console.log('🟡 [CREDENTIALS] Bcrypt result:', result); // ← Логировать результат

        return result;
        }

}