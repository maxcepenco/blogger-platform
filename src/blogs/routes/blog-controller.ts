import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../../core/types/RequestInputType";
import {BlogInputModel} from "../input/blog-input-model";
import {Response} from "express";
import {HttpStatuses} from "../../core/types/httpSatuses";
import {blogPostInput} from "../input/blog-post-input-model";
import {PostService} from "../../posts/application/post.service";
import {PostQueryRepository} from "../../posts/repository/post.query-repository";
import {idType} from "../../core/types/InputIUriParamsModel";
import {PostQueryInput} from "../../posts/input/post-query.input";
import {setDefaultPostQueryParams} from "../../core/helpers/set-default-sort-and-pagination";
import {BlogQueryInput} from "../input/blog-query.input";
import {sortQueryFieldsUtil} from "../../core/helpers/sort-query-fields-util";
import {BlogService} from "../application/blog.servece";
import {BlogQueryRepository} from "../repository/blog.query-repository";


export class BlogController {


    constructor(protected blogService: BlogService,
                protected blogQueryRepository: BlogQueryRepository,
                protected postService: PostService,
                protected postQueryRepository: PostQueryRepository) {
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
            const blogViewModel = this.blogQueryRepository.mapToBlogViewModel(foundBlog)

            res
                .status(HttpStatuses.Created_201)
                .send(blogViewModel)
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
                res.sendStatus(HttpStatuses.NotFound_404);
                return
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

        const blogVewModel = this.blogQueryRepository.mapToBlogViewModel(foundBlog);

        res.status(HttpStatuses.Ok_200).send(blogVewModel)

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
        const isDeleted = await this.blogService.deleteBlog(req.params.id)
        if (!isDeleted) {
            res.sendStatus(HttpStatuses.NotFound_404);
        }

        res.sendStatus(HttpStatuses.NoContent_204)

    }
}

