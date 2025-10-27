import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../../core/types/RequestInputType";
import {BlogInputModel} from "../types/input/blog-input-model";
import {Response} from "express";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {blogPostInput} from "../types/input/blog-post-input-model";
import {PostService} from "../../posts/domain/post.service";
import {PostQueryRepository} from "../../posts/repository/post.query-repository";
import {idType} from "../../core/types/InputIUriParamsModel";
import {PostQueryInput} from "../../posts/types/input/post-query.input";
import {setDefaultPostQueryParams} from "../../core/helpers/set-default-sort-and-pagination";
import {BlogQueryInput} from "../types/input/blog-query.input";
import {sortQueryFieldsUtil} from "../../core/helpers/sort-query-fields-util";
import {BlogService} from "../domain/blog.servece";
import {BlogQueryRepository} from "../repository/blog.query-repository";
import {inject, injectable} from "inversify";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {ResultStatus} from "../../core/result/result-code";

@injectable()
export class BlogController {

    constructor(@inject(BlogService) protected blogService: BlogService,
                @inject(BlogQueryRepository) protected blogQueryRepository: BlogQueryRepository,
                @inject(PostService) protected postService: PostService,
                @inject(PostQueryRepository) protected postQueryRepository: PostQueryRepository) {
    }

    async createBlog(req: RequestWithBody<BlogInputModel>, res: Response) {
        try {
            const createdBlog = await this.blogService.create(req.body);

            const foundBlog = await this.blogQueryRepository.findById(createdBlog.data)

            if (!foundBlog) {
                return res.status(HttpStatuses.BadRequest_400).json({
                    errorsMessages: [{
                        message: "Failed to retrieve created post",
                        field: "server"
                    }]
                });
            }

            res
                .status(HttpStatuses.Created_201)
                .send(createdBlog)
        } catch (error) {
            res.status(HttpStatuses.BadRequest_400).send({
                errorsMessages: [{
                    message: "Failed to create blog",
                    field: "general"
                }]
            });
        }

    }

    async createPostForBlog(req: RequestWithParamsAndBody<{ blogId: string }, blogPostInput>, res: Response) {
        try {
            const blogId = req.params.blogId;

            const existingBlog = await this.blogQueryRepository.findById(blogId);

            if (!existingBlog) {
                return  res.sendStatus(HttpStatuses.NotFound_404);

            }


            const createdPostForId = await this.postService.createPostForBlog(blogId, existingBlog.name, req.body);

            const createdPost = await this.postQueryRepository.findPostById(createdPostForId)
            if (!createdPost) {
                return res.sendStatus(HttpStatuses.NotFound_404);
            }
            res.status(HttpStatuses.Created_201).send(createdPost)
        } catch (error) {
            return res.status(500).json({
                errorsMessages: [{field: "server", message: "Internal server error"}]
            });
        }
    }

    async findBlogBiId(req: RequestWithParams<idType>, res: Response) {

        const id = req.params.id
        const foundBlog = await this.blogQueryRepository.findById(id);

        if (!foundBlog) {
            return res.sendStatus(HttpStatuses.NotFound_404)

        }


        res.status(HttpStatuses.Ok_200).send(foundBlog)

    }

    async getBlogPostList(req: RequestWithParams<{ blogId: string }>, res: Response) {
        const query = req.query as unknown as PostQueryInput
        const blogId = req.params.blogId;

        const blogExists = await this.blogQueryRepository.findById(blogId);
        if (!blogExists) {
            res.sendStatus(HttpStatuses.NotFound_404)
            return
        }
        const queryInput = setDefaultPostQueryParams(query)

        const {items, totalCount} = await this.postQueryRepository.findPostByBlog(
            queryInput,
            blogId,
        );
        const postListOutput = this.postQueryRepository.mapToPostListPaginationOutput(
            items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount
        )
        res.status(HttpStatuses.Ok_200).send(postListOutput)


    }

    async getAllBlogs(req: RequestWithQuery<BlogQueryInput>, res: Response) {
        try {


            const queryInput = sortQueryFieldsUtil(req.query);
            const searchQueryFiled = req.query

            const result = await this.blogQueryRepository.findMany(queryInput, searchQueryFiled);

            res.status(HttpStatuses.Ok_200).json(result);


        } catch (error) {
            console.error('Error in getAllBlogs:', error);
            res.status(HttpStatuses.InternalServerError_500)
                .json({error: error instanceof Error ? error.message : 'Internal server error'});
        }
    }

    async updateBlog(req: RequestWithParamsAndBody<idType, BlogInputModel>, res: Response) {
        const index = req.params.id


        const isUpdateBlog = await this.blogService.updateBlog(index, req.body)
        if (!isUpdateBlog) {
            res.sendStatus(HttpStatuses.NotFound_404)
            return
        }
        res.sendStatus(HttpStatuses.NoContent_204)

    }

    async deleteBlog(req: RequestWithParams<idType>, res: Response) {
        const result = await this.blogService.deleteBlog(req.params.id)
        if (result.status !== ResultStatus.Success) {
          return  res.sendStatus(resultCodeToHttpException(result.status));
        }

        res.sendStatus(HttpStatuses.NoContent_204)

    }
}

