import {Response} from "express";
import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {BlogQueryInput} from "../../input/blog-query.input";
import {blogService} from "../../application/blog.servece";
import {mapToBlogListPaginationOutput} from "../mappers/map-to-blog-list-pagination-output.util";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {setDefaultBlogQueryParams} from "../../../core/helpers/set-default-sort-and-pagination";


export const getAllBlogs = async (req: RequestWithQuery<BlogQueryInput>, res: Response) => {
    try {
        const queryInput = setDefaultBlogQueryParams(req.query);

        const result = await blogService.findMany(queryInput);
        const items = result.items;
        const totalCount = result.totalCount;

        const BlogListOutput = mapToBlogListPaginationOutput(
            items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount,
        );

        res.status(HttpStatuses.Ok_200).json(BlogListOutput);
    } catch (error) {
        console.error('Error in getAllBlogs:', error);
        res.status(HttpStatuses.InternalServerError_500).json({
            error: 'Internal server error'
        });
    }
};