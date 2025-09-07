import {RequestWithParamsAndQuery} from "../../../core/types/RequestInputType";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel";
import {BlogQueryInput} from "../../input/blog-query.input";
import {PostQueryInput} from "../../../posts/input/post-query.input";
import {postService} from "../../../posts/application/post.service";
import {mapToPostListPaginationOutput} from "../../../posts/router/mappers/map-to-post-list-pagination-output.util";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";


export async function getBlogPostList(
    req: RequestWithParamsAndQuery<UriParamsInputDto, PostQueryInput>, res:Response
) {
    try{
        const blogId = req.params.id;
        const  queryInput = req.query;

        const { items, totalCount } = await postService.findPostByBlog(
            queryInput,
            blogId,
        );
        const postListOutput = mapToPostListPaginationOutput(
            items,
            totalCount,
            queryInput.pageSize,
            queryInput.pageNumber
        )
        res.status(HttpStatuses.Ok_200).send(postListOutput)

    }catch (error) {
        res.status(HttpStatuses.BadRequest_400).send({
            errorsMessages: [{
                message: "Failed to create post",
                field: "general"
            }]
        });
    }

}