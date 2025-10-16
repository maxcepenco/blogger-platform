import {UserInputModel} from "../input-model/input-model.user";
import {bcryptService} from "../../auth/adapters/bcrypt.service";
import {UserAccountDBType} from "../types-user/UserAccountDBType";
import {userRepository} from "../repository/user.repository";


class UserService {
    async createUser(userDto:UserInputModel):Promise< string> {
          const { password } = userDto;

         const passwordHash =  await bcryptService.generateHash(password);

         const newUser: UserAccountDBType = {
             accountDate:{
                 login:userDto.login,
                 email: userDto.email,
                 passwordHash: passwordHash,
                 createdAt: new Date(),
             },
             emailConfirmed: null,
             isConfirmed: true
         }

         return await userRepository.create(newUser)
    }

    async deleteUser(id: string):Promise< boolean> {
        return userRepository.delete(id)
    }
}

export const userService = new UserService()