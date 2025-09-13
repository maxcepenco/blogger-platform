import {User} from "../types-user/User";
import {userCollection} from "../../db/mongoDB";
import {ObjectId, WithId} from "mongodb";
import {UserViewModel} from "../output-model/output-model.user";
import {SearchQueryFieldType} from "../input-model/user-query-field.type";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";
import {SortQueryFilterType} from "../../core/types/sortQueryFilter.type";


export const userQueryRepository = {

    async findById(userId: string ): Promise< UserViewModel  | null> {
        const user = await userCollection.findOne({ _id:new ObjectId(userId) });
        if (!user) {
            return null;
        }
        return this.mapToUserViewModel(user);
    },

    async findMany(queryField:SortQueryFilterType, searchField: SearchQueryFieldType)
                    : Promise<PaginateQueryOutput<UserViewModel>> {
        const {
            sortBy,
            pageNumber,
            pageSize,
            sortDirection
        } = queryField;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        const { searchLoginTerm, searchEmailTerm } = searchField;

        if(searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: "i"};
        }
        if(searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: "i"};
        }

        const items = await userCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await userCollection.countDocuments(filter);
        const  result = this.mapToUserListPagination(items, pageNumber, pageSize, totalCount)
        return result
    },






    mapToUserViewModel(user:WithId<User>):UserViewModel {
        return{
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },

    mapToUserListPagination(
        items: WithId<User>[],
        pageNumber: number,
        pageSize: number,
        totalCount: number

    ): PaginateQueryOutput<UserViewModel> {
        const pagesCount = Math.ceil(totalCount/ pageSize);

        return {
            pagesCount,
            page:pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(this.mapToUserViewModel)
        }
    }

}