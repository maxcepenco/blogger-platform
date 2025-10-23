

import {UserAccountDBType} from "../types-user/UserAccountDBType";
import {userCollection} from "../../db/mongoDB";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UserRepository {

    async create(user: UserAccountDBType): Promise<string> {
        const newUser = await userCollection.insertOne(user)
        return newUser.insertedId.toString()
    }

    async delete(id: string): Promise<boolean> {
        const deleteResult = await userCollection.deleteOne({_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1
    }

    async findByLoginOrEmail(loginOrEmail: string,): Promise<WithId<UserAccountDBType> | null> {

        const result = await userCollection.findOne({
            $or: [
                {"accountDate.login": loginOrEmail},
                {"accountDate.email": loginOrEmail}]
        })

        return result

    }

    async findExistByLoginOrEmail(
        login: string,
        email: string
    ): Promise<WithId<UserAccountDBType> | null> {
        const user = await userCollection.findOne({
            $or: [
                {'accountDate.login': login},
                {'accountDate.email': email},
            ],
        });

        return user;

    }

    async findByCode(code: string): Promise<WithId<UserAccountDBType> | null> {

        const user = await userCollection.findOne({
            'emailConfirmed.confirmationCode': code,
            'emailConfirmed': {$ne: null}
        });

        if (!user) {
            return null;
        }
        return user;
    }

    async findByRecoveryCode(code: string): Promise<WithId<UserAccountDBType> | null> {

        const user = await userCollection.findOne({
            'passwordRecovery.recoveryCode': code,
        });

        if (!user) {
            return null;
        }
        return user;
    }

    async updateUser(_id: ObjectId): Promise<boolean> {
        let result = await userCollection
            .updateOne(
                {_id},
                {
                    $set: {isConfirmed: true}
                })
        return result.modifiedCount === 1
    }

    async updateUserPassword(_id: ObjectId, newPassword:string): Promise<boolean> {
        let result = await userCollection
            .updateOne(
                {_id},
                {
                    $set: {'accountDate.passwordHash': newPassword },
                    $unset: { passwordRecovery: '' }, // 🧽 очищаем код

                })
        return result.modifiedCount === 1
    }

    async updateConfirmationData(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
        const result = await userCollection.updateOne(
            {_id},
            {
                $set: {
                    'emailConfirmed.confirmationCode': code,
                    'emailConfirmed.expirationDate': expirationDate,
                }
            })

        return result.modifiedCount === 1
    }

    async updatePasswordRecoveryCode(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
        const result = await userCollection.updateOne(
            {_id},
            {
                $set: {
                    'passwordRecovery.recoveryCode': code,
                    'passwordRecovery.expirationDate': expirationDate,
                }
            }
        )
        return result.modifiedCount === 1

    }
}

