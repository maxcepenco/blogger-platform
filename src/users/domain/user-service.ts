import {UserInputModel} from "../routes/input-model/input-model.user";
import {bcryptService} from "../../auth/adapters/bcrypt.service";
import {UserAccountDBType} from "../types-user/UserAccountDBType";
import {UserRepository} from "../repository/user.repository";
import {inject, injectable} from "inversify";

@injectable()
export class UserService {

    constructor(@inject(UserRepository)protected userRepository: UserRepository) {}

    async createUser(userDto: UserInputModel): Promise<string> {
        const {password} = userDto;

        const passwordHash = await bcryptService.generateHash(password);

        const newUser: UserAccountDBType = {
            accountDate: {
                login: userDto.login,
                email: userDto.email,
                passwordHash: passwordHash,
                createdAt: new Date(),
            },
            emailConfirmed: null,
            isConfirmed: true
        }

        return await this.userRepository.create(newUser)
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.userRepository.delete(id)
    }
}

