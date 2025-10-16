import {UserAccountDBType} from "../types-user/UserAccountDBType";
import {userCollection} from "../../db/mongoDB";
import {ObjectId, Sort, WithId} from "mongodb";
import {UserViewAuthMe, UserViewModel} from "../output-model/output-model.user";
import {SearchQueryFieldType} from "../input-model/user-query-field.type";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";
import {SortQueryFilterType} from "../../core/types/sortQueryFilter.type";


class UserQueryRepository {

    async findById(userId: string): Promise<UserViewModel | null> {
        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) {
            return null;
        }
        return this.mapToUserViewModel(user);


    }

    async findByIdForMe(userId: string): Promise<UserViewAuthMe | null> {
        console.log(`fidnUserForId: ${userId}`);

        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        console.log(`foundUser: ${user}`);

        if (!user) {
            return null;
        }
        return this.mapToAuthMeView(user);
    }


    async findMany(queryField: SortQueryFilterType, searchField: SearchQueryFieldType)
        : Promise<PaginateQueryOutput<UserViewModel>> {
        const {
            sortBy,
            pageNumber,
            pageSize,
            sortDirection
        } = queryField;

        const {searchLoginTerm, searchEmailTerm} = searchField;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};
        const searchConditions: any[] = [];

        if (searchLoginTerm) {
            searchConditions.push({
                "accountDate.login": {$regex: searchLoginTerm, $options: "i"}
            });
        }

        if (searchEmailTerm) {
            searchConditions.push({
                "accountDate.email": {$regex: searchEmailTerm, $options: "i"}
            });
        }

        // Если есть условия поиска, используем $or
        if (searchConditions.length > 0) {
            filter.$or = searchConditions;
        }
        const sortField = sortBy.includes('.') ? sortBy : `accountDate.${sortBy}`;

        // Исправление типизации для sort
        const sortObject: Sort = {
            [sortField]: sortDirection === 'desc' ? -1 : 1
        } as Sort

        const items = await userCollection
            .find(filter)
            .sort(sortObject)
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments(filter);
        const result = this.mapToUserListPagination(items, pageNumber, pageSize, totalCount)
        return result
    }


    mapToUserViewModel(user: WithId<UserAccountDBType>): UserViewModel {
        return {

            id: user._id.toString(),
            login: user.accountDate.login,
            email: user.accountDate.email,
            createdAt: user.accountDate.createdAt.toISOString(),
        }
    }


    mapToAuthMeView(user: WithId<UserAccountDBType>): UserViewAuthMe {
        return {

            userId: user._id.toString(),
            login: user.accountDate.login,
            email: user.accountDate.email,
        }
    }


    mapToUserListPagination(
        items: WithId<UserAccountDBType>[],
        pageNumber: number,
        pageSize: number,
        totalCount: number
    ): PaginateQueryOutput<UserViewModel> {
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(this.mapToUserViewModel)
        }
    }

}

export const userQueryRepository = new UserQueryRepository();