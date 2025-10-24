import {BlogDbType} from "../dto/Blog";
// import {blogCollection} from "../../db/mongoDB";
import {BlogViewModel} from "../types/output/blog-view-model";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";
import {SearchFieldTypeBlog} from "../types/input/search-blog-type";
import {SortQueryFilterType} from "../../core/types/sortQueryFilter.type";
import {injectable} from "inversify";
import {BlogModel} from "./blog.model";

@injectable()
export class BlogQueryRepository {

    async findMany(inputParams: SortQueryFilterType, searchType: SearchFieldTypeBlog): Promise<PaginateQueryOutput<BlogViewModel>> {
        const {

            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = inputParams;

        const {searchNameTerm} = searchType;


        const skip = (pageNumber - 1) * pageSize;

        const filter: any = {};

        if (searchNameTerm && searchNameTerm.trim() !== '') {
            filter.name = {$regex: searchNameTerm.trim(), $options: "i"};
        }


        const items = await BlogModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .lean()


        const totalCount = await BlogModel.countDocuments(filter);
        const result = this.mapToBlogListPaginationOutput(items, pageNumber, pageSize, totalCount)
        return result
    }

    async findById(id: string): Promise< BlogDbType  | null> {
        const result = await BlogModel.findById(id).lean();
        return result;
    }


    mapToBlogViewModel(blog: BlogDbType): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt.toISOString(),
            isMembership: false
        }
    }

    mapToBlogListPaginationOutput(
        items: BlogDbType [],
        pageNumber: number,
        pageSize: number,
        totalCount: number
    ): PaginateQueryOutput<BlogViewModel> {
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(blog => this.mapToBlogViewModel(blog))
        }
    }

}


