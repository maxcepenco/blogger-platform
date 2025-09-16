import {UserInputModel} from "../input-model/input-model.user";
import {bcryptService} from "../../auth/adapters/bcrypt.service";
import {User} from "../types-user/User";
import {userRepository} from "../repository/user.repository";
import {UserDb} from "../types-user/user-db";


export const userService = {
    async createUser(userDto:UserInputModel):Promise< string> {
          const { password } = userDto;

         const passwordHash =  await bcryptService.generateHash(password);

         const newUser: User = {
             login:userDto.login,
             email: userDto.email,
             passwordHash: passwordHash,
             createdAt: new Date().toISOString(),
         }

         return await userRepository.create(newUser)
    },

    async deleteUser(id: string):Promise< boolean> {
        return userRepository.delete(id)
    }
}