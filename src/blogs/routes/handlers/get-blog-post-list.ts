import {PostQueryInput} from "../../../posts/input/post-query.input";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Request, Response} from "express";
import {setDefaultPostQueryParams,} from "../../../core/helpers/set-default-sort-and-pagination";
import {blogQueryRepository} from "../../repository/blog.query-repository";
import {postQueryRepository} from "../../../posts/repository/post.query-repository";


export async function getBlogPostList(
    req: Request<{ blogId: string }>,
    res: Response,
) {
        const query = req.query as unknown as PostQueryInput
        const blogId = req.params.blogId;

        const blogExists = await blogQueryRepository.findById(blogId);
        if (!blogExists) {
            res.sendStatus(HttpStatuses.NotFound_404)
                return
        }
        const  queryInput = setDefaultPostQueryParams(query)

        const { items, totalCount } = await postQueryRepository.findPostByBlog(
            queryInput,
            blogId,
        );
        const postListOutput = postQueryRepository.mapToPostListPaginationOutput(
            items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount
        )
        res.status(HttpStatuses.Ok_200).send(postListOutput)



}