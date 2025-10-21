import {UserQueryRepository} from "../../users/repository/user.query-repository";
import {CommentRepository} from "../repository/commnet-repository";
import {CommentDbType} from "../types/comment-db-type";
import {Result} from "../../core/result/result-type";
import {ResultStatus} from "../../core/result/result-code";
import {inject, injectable} from "inversify";
import {CommentController} from "../controller/comment-controller";

@injectable()
export class CommentService {


    constructor(@inject(CommentController) protected commentRepository: CommentRepository,
                @inject(UserQueryRepository) protected userQueryRepository: UserQueryRepository) {
    }

    async createComment(postId: string, userId: string, content: string): Promise<string | null> {

        const user = await this.userQueryRepository.findById(userId!); //TODO: Сервис не может ходить к QueryRepo-НАДО ИСПРАВИТЬ!!!
        if (!user) {
            return null
        }
        const newComment = {
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }

        return await this.commentRepository.createCommentForPost(newComment)

    }

    async updateComment(commentId: string, comment: string, userId: string): Promise<Result<boolean | null>> {

        const foundComment = await this.commentRepository.findByIdDbType(commentId);
        if (!foundComment) {
            return {
                status: ResultStatus.NotFound,
                data: null,
            }
        }
        if (userId !== foundComment.commentatorInfo.userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
            };
        }
        const updatedComment: CommentDbType = {
            postId: foundComment.postId,
            content: comment,
            commentatorInfo: foundComment.commentatorInfo,
            createdAt: foundComment.createdAt
        }

        const result = await this.commentRepository.update(commentId, updatedComment)
        return {
            status: ResultStatus.Success,
            data: result,
        }

    }

    async deleteComment(commentId: string, userId: string): Promise<Result<boolean | null>> {

        const foundComment = await this.commentRepository.findByIdDbType(commentId);
        if (!foundComment) {
            return {
                status: ResultStatus.NotFound,
                data: null,
            }
        }
        if (userId !== foundComment.commentatorInfo.userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
            }
        }

        const result = await this.commentRepository.delete(commentId)
        return {
            status: ResultStatus.Success,
            data: result,
        }
    }


}

