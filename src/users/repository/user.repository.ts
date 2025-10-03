import {UserAccountDBType} from "../types-user/UserAccountDBType";
import {refreshTokenCollection, userCollection} from "../../db/mongoDB";
import {ObjectId, WithId} from "mongodb";
import {RefreshTokenDbType} from "../../auth/dto/refresh-token";


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

        const result = await userCollection.findOne({$or:[
                { "accountDate.login": loginOrEmail },
                { "accountDate.email": loginOrEmail }]})

        return result

    },

    async findExistByLoginOrEmail(
        login: string,
        email: string
    ): Promise<WithId<UserAccountDBType> | null> {
        const user = await userCollection.findOne({
            $or: [
                { 'accountDate.login': login },
                { 'accountDate.email': email },
            ],
        });

        return user;

    },

    async findByCode(code: string): Promise<WithId<UserAccountDBType> | null > {
        console.log('Searching for code:', code);

        const user = await userCollection.findOne({
            'emailConfirmed.confirmationCode': code,
            'emailConfirmed': {$ne: null}
        });
        console.log('Searching for user:', user);

        if(!user) {
            console.log(' user found?:', user);
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
    },

    async updateConfirmationData(_id:ObjectId, code: string, expirationDate:Date): Promise<boolean> {
        const result = await userCollection.updateOne(
            {_id},
            {$set:{
                'emailConfirmed.confirmationCode':code,
                'emailConfirmed.expirationDate':expirationDate,
            }})

        return result.modifiedCount === 1
    },

    async findOldRefreshToken(refreshToken:string, userId:string):Promise<boolean> {
        const oldToken = await refreshTokenCollection.findOne({token: refreshToken, userId: userId});
        return !!oldToken;
    },
    async saveOlsRefreshToken(tokenObj: RefreshTokenDbType):Promise<void> {
         await refreshTokenCollection.insertOne(tokenObj);

    }
}