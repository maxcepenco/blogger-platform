import {
    ReqParamsBodyUserId,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../core/types/RequestInputType";
import {PostInputModel} from "../types/input/post-input-model";
import {PostService} from "../domain/post.service";
import {ResultStatus} from "../../core/result/result-code";
import {resultCodeToHttpException} from "../../core/result/resultCodeToHttpException";
import {PostQueryRepository} from "../repository/post.query-repository";
import {HttpStatuses} from "../../core/types/httpSatuses"
import {Response} from "express";
import {IdType} from "../../core/types/id-type.user";
import {idType} from "../../core/types/InputIUriParamsModel";
import {CommentService} from "../../comments/domain/commnetService";
import {CommentQueryRepository} from "../../comments/repository/comment-query-repository";
import {SortQueryFieldsType} from "../../core/types/sortQueryFields.type";
import {sortQueryFieldsUtil} from "../../core/helpers/sort-query-fields-util";
import {PostQueryInput} from "../types/input/post-query.input";
import {setDefaultPostQueryParams} from "../../core/helpers/set-default-sort-and-pagination";
import {inject, injectable} from "inversify";
import {UserQueryRepository} from "../../users/repository/user.query-repository";
import {CommentInputModel} from "../../comments/types/input/likeStatus.input-model";

@injectable()
export class PostController {


    constructor(@inject(PostService) protected postService: PostService,
                @inject(PostQueryRepository) protected postQueryRepository: PostQueryRepository,
                @inject(CommentService) protected commentService: CommentService,
                @inject(CommentQueryRepository) protected commentQueryRepository: CommentQueryRepository,
                @inject(UserQueryRepository) protected userQueryRepository: UserQueryRepository) {}

    async createPost(req: RequestWithBody<PostInputModel>, res: Response) {
        try {
            const result = await this.postService.createPost(req.body)
            if (result.status !== ResultStatus.Success || result.data === null) {
                return res.sendStatus(resultCodeToHttpException(result.status))
            }
            const createdPost = await this.postQueryRepository.findPostById(result.data)
            if (!createdPost) {

                return res.status(HttpStatuses.BadRequest_400).json({
                    errorsMessages: [{
                        message: "Failed to retrieve created post",
                        field: "server"
                    }]
                });
            }
            res.status(HttpStatuses.Created_201).send(createdPost)

        } catch (error) {
            res.status(HttpStatuses.BadRequest_400).send({
                errorsMessages: [{
                    message: "Failed to create post",
                    field: "general"
                }]
            });
        }

    }

    async createCommentForPost(req: ReqParamsBodyUserId<idType, CommentInputModel, IdType>, res: Response) {
        const userId = req.user as string;

        const user = await this.userQueryRepository.findById(userId);
        if (!user) {
            return res.sendStatus(HttpStatuses.BadRequest_400)
        }

        const postId = req.params.id
        const existingPost = await this.postQueryRepository.findPostById(postId)
        if (!existingPost) {
            res.sendStatus(HttpStatuses.NotFound_404)
            return
        }

        const createdIdComment = await this.commentService.createComment(postId, user.id, user.login, req.body.content)
        console.log('🟢 createdIdComment:', createdIdComment);
        console.log('📏 Type:', typeof createdIdComment, 'Length:', createdIdComment?.length);
        if (!createdIdComment) {

            return res.sendStatus(HttpStatuses.BadRequest_400)
        }

        const createdComment = await this.commentQueryRepository.findById(createdIdComment)


        if (!createdComment) {
            return res.sendStatus(HttpStatuses.NotFound_404)
        }

        res.status(HttpStatuses.Created_201).send(createdComment)
    }

    async getCommentForPost(req: RequestWithParamsAndQuery<IdType, SortQueryFieldsType>, res: Response) {

        const postId = req.params.id


        const post = await this.postQueryRepository.findPostById(postId)
        if (!post) {

            res.sendStatus(HttpStatuses.NotFound_404)
        }

        const inputQuery = sortQueryFieldsUtil(req.query);

        const foundCommentForPost = await this.commentQueryRepository.findCommentByPost(inputQuery, postId);

        res.status(HttpStatuses.Ok_200).json(foundCommentForPost);

    }

    async findPostBiId(req: RequestWithParams<idType>, res: Response) {

        const index = req.params.id;
        const foundPostById = await this.postQueryRepository.findPostById(index);

        if (!foundPostById) {
            return res.sendStatus(HttpStatuses.NotFound_404)
        }

        res.status(HttpStatuses.Ok_200).send(foundPostById);

    }

    async getPostList(req: RequestWithQuery<PostQueryInput>, res: Response) {
        const queryInput = setDefaultPostQueryParams(req.query)

        const {items, totalCount} = await this.postQueryRepository.findMany(queryInput)

        const postListOutput = this.postQueryRepository.mapToPostListPaginationOutput(
            items,
            queryInput.pageNumber,
            queryInput.pageSize,
            totalCount,
        )
        res.status(HttpStatuses.Ok_200).send(postListOutput)
    }

    async updatePost(req: RequestWithParamsAndBody<idType, PostInputModel>, res: Response) {

        const updateThisPost = await this.postService.updatePost(req.params.id, req.body)
        if (!updateThisPost) {
            res.sendStatus(HttpStatuses.NotFound_404)
            return
        }
        res.sendStatus(HttpStatuses.NoContent_204)
    }

    async deletePost(req: RequestWithParams<idType>, res: Response) {
        const deleteIndex = await this.postService.deletePost(req.params.id)
        if (!deleteIndex) {
            res.sendStatus(HttpStatuses.NotFound_404)
            return
        }
        res.sendStatus(HttpStatuses.NoContent_204)
    }
}

