import {Response} from "express";
import {RequestWithQuery} from "../../../core/types/RequestInputType";
import {BlogQueryInput} from "../../input/blog-query.input";
import {blogService} from "../../application/blog.servece";
import {mapToBlogListPaginationOutput} from "../mappers/map-to-blog-list-pagination-output.util";

export const getAllBlogs =async ( req:RequestWithQuery<BlogQueryInput>, res:Response ) => {

    const queryInput = req.query

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