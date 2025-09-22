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

    async findByLoginOrEmail(loginOrEmail: string,): Promise<WithId<UserAccountDBType> | null> {

        const result = await userCollection.findOne({$or:[{ email: loginOrEmail }, { login: loginOrEmail }]})

        return result

    },

    async findExistByLoginOrEmail(
        login: string,
        email: string
    ): Promise<boolean> {
        const user = await userCollection.findOne({
            $or: [{ login }, { email }],
        });

        return user !== null;

    },

    async findByCode(code: string): Promise<WithId<UserAccountDBType> | null > {
        const user = await userCollection.findOne({'emailConfirmation.confirmationCode': code});
        if(!user) {
            return null;
        }
        return user;
    },

    async updateUser(_id: ObjectId):Promise<boolean> {
        let result = await userCollection
                            .updateOne(
                                {_id},
                                {$set:{isConfirmed:true}
                            })
        return result.modifiedCount === 1
    }

}