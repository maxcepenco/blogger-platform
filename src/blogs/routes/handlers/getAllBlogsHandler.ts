import {Response} from "express";
import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {BlogQueryInput} from "../../input/blog-query.input";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/set-default-sort-and-pagination";
import {blogService} from "../../application/blog.servece";
import {mapToBlogListPaginationOutput} from "../mappers/map-to-blog-list-pagination-output.util";

export const getAllBlogs =async ( req:RequestWithQuery<BlogQueryInput>, res:Response ) => {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query)
    const result = await blogService.findMany(queryInput)
    const items = result.items;
    const totalCount = result.totalCount

    const BlogListOutput = mapToBlogListPaginationOutput(
        items,
        totalCount,
        queryInput.pageSize,
        queryInput.pageNumber
    )
    res.send(BlogListOutput);
}