import {UserAccountDBType} from "../types-user/UserAccountDBType";
import {userCollection} from "../../db/mongoDB";
import {ObjectId, WithId} from "mongodb";


export const userRepository = {

    async create(user: UserAccountDBType): Promise<string> {
        const newUser = await userCollection.insertOne(user)
        return newUser.insertedId.toString()
    },

    async delete(id: string): Promise<boolean> {
        const deleteResult = await userCollection.deleteOne( {_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserAccountDBType> | null> {

        const result = await userCollection.findOne({$or:[{ email: loginOrEmail }, { login: loginOrEmail }]})

        return result

    }
}