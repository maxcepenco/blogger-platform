import {Blog} from "../domain/Blog";
import {ObjectId, WithId} from "mongodb";
import {blogCollection} from "../../db/mongoDB";
import {BlogViewModel} from "../output/blog-view-model";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";
import {SearchFieldTypeBlog} from "../input/search-blog-type";
import {SortQueryFilterType} from "../../core/types/sortQueryFilter.type";


export const blogQueryRepository = {

    async findMany(inputParams:SortQueryFilterType, searchType: SearchFieldTypeBlog): Promise<PaginateQueryOutput<BlogViewModel>> {
            const {

                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            } = inputParams;

            const { searchNameTerm} = searchType;


        const skip = (pageNumber - 1) * pageSize;

        const filter: any = {};

            if (searchNameTerm && searchNameTerm.trim() !== '') {
                filter.name = {$regex: searchNameTerm.trim(), $options: "i"};
            }



            const items = await blogCollection
                    .find(filter)
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(pageSize)
                    .toArray()


            const totalCount = await blogCollection.countDocuments(filter);
            const result = this.mapToBlogListPaginationOutput(items, pageNumber, pageSize, totalCount)
            return result
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


