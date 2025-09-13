import {Blog} from "../domain/Blog";
import {ObjectId, WithId} from "mongodb";
import {blogCollection} from "../../db/mongoDB";
import {BlogViewModel} from "../output/blog-view-model";
import {BlogQueryInput} from "../input/blog-query.input";
import {SortDirection} from "../../core/types/sort-direction";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";


export const blogQueryRepository = {

    async findMany(inputParams: BlogQueryInput): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
            const {
                searchNameTerm,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = inputParams;

            const skip = (pageNumber - 1) * pageSize;
            const filter: any = {};

            if (searchNameTerm && searchNameTerm.trim() !== '') {
                filter.name = {$regex: searchNameTerm.trim(), $options: "i"};
            }

            const mongoSortDirection = sortDirection === SortDirection.Asc ? 1 : -1;


            const [items, totalCount] = await Promise.all([
                blogCollection
                    .find(filter)
                    .sort({[sortBy]: mongoSortDirection})
                    .skip(skip)
                    .limit(pageSize)
                    .toArray(),
                blogCollection.countDocuments(filter)
            ]);

            return {items, totalCount};
        },

    async findById(id: string): Promise<WithId<Blog> | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        }
       return  await blogCollection.findOne({_id: new ObjectId(id)});


    },


    mapToBlogViewModel(blog: WithId<Blog>): BlogViewModel {
        return {
            id:blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false
        }
    },

    mapToBlogListPaginationOutput(
        items: WithId<Blog>[],
        pageNumber: number,
        pageSize: number,
        totalCount: number

    ): PaginateQueryOutput<BlogViewModel> {
        const pagesCount = Math.ceil(totalCount/ pageSize);

        return {
            pagesCount,
            page:pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(this.mapToBlogViewModel)
        }
    }

}


