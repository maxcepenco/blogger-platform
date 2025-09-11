import {Response} from "express";
import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {setDefaultBlogQueryParams} from "../../../core/helpers/set-default-sort-and-pagination";
import {QueryParams} from "../../../core/types/QuareParams";
import {blogQueryRepository} from "../../repository/blog.query-repository";


export const getAllBlogs = async (req: RequestWithQuery<QueryParams>, res: Response) => {
    try {


        const queryInput = setDefaultBlogQueryParams(req.query);

        const result = await blogQueryRepository.findMany(queryInput);
        const items = result.items;
        const totalCount = result.totalCount;

        const BlogListOutput = blogQueryRepository.mapToBlogListPaginationOutput(
            items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount,
        );

        res.status(HttpStatuses.Ok_200).json(BlogListOutput);
    } catch (error) {
        console.error('Error in getAllBlogs:', error);
        res.status(HttpStatuses.InternalServerError_500)
            .json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
};
