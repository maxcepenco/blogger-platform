import {UserQueryRepository} from "../../users/repository/user.query-repository";
import {CommentRepository} from "../repository/commnet-repository";
import {CommentDbType, LikeStatus} from "../types/comment-db-type";
import {Result} from "../../core/result/result-type";
import {ResultStatus} from "../../core/result/result-code";
import {inject, injectable} from "inversify";
import {CommentModel, LikeModel} from "../repository/comment-model";

@injectable()
export class CommentService {


    constructor(@inject(CommentRepository) protected commentRepository: CommentRepository,
                @inject(UserQueryRepository) protected userQueryRepository: UserQueryRepository) {
    }

    async createComment(postId: string, userId: string, userLogin: string, content: string): Promise<string | null> {

        const newComment = new CommentModel(
            {
                postId: postId,
                content: content,
                commentatorInfo: {
                    userId: userId,
                    userLogin: userLogin,
                },

            })

        // const newComment:CommentDbType = {
        //     postId: postId,
        //     content: content,
        //     commentatorInfo: {
        //         userId: userId,
        //         userLogin: userLogin
        //     },
        //     likesInfo:{
        //         likesCount: 0,
        //         dislikesCount: 0
        //     },
        //     createdAt: new Date().toISOString()
        // }
        const result = await this.commentRepository.saveComment(newComment)
        if (!result) {
            return null;
        }
        return result;
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
            createdAt: foundComment.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            }
        }

        const result = await this.commentRepository.update(commentId, updatedComment)
        return {
            status: ResultStatus.Success,
            data: result,
        }

    }

    async addLikeForComment(commentId: string, likeStatus: LikeStatus, userId: string): Promise<Result<boolean>> {

        if (!likeStatus) {
            return {
                status: ResultStatus.BadRequest,
                data: false,
                errorMessage: "Bad Request",
            }
        }

        const comment = await this.commentRepository.findByIdDbType(commentId)
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                data: false,
                errorMessage: "Not found"
            }
        }
        const existingLike = await this.commentRepository.findLike(commentId, userId);

        if (!existingLike) {

            const likeInfo = new LikeModel()
            likeInfo.commentId = commentId
            likeInfo.userId = userId
            likeInfo.myStatus = likeStatus
            console.log("likeInfo",likeInfo)
            await this.commentRepository.saveLikeInfo(likeInfo)


            if (likeStatus === LikeStatus.Like) {
                comment.likesInfo.likesCount++

            }

            if (likeStatus === LikeStatus.Dislike) {
                comment.likesInfo.dislikesCount++

            }
            await this.commentRepository.saveComment(comment)

            return {
                status: ResultStatus.Success,
                data: true
            }
        }

        if (likeStatus === existingLike.myStatus && likeStatus === LikeStatus.None) {
            return {
                status: ResultStatus.Success,
                data: true
            }
        }

        if (likeStatus === LikeStatus.Like && existingLike.myStatus === LikeStatus.Dislike) {

            comment.likesInfo.dislikesCount--
            comment.likesInfo.likesCount++

            await this.commentRepository.saveComment(comment)

            existingLike.myStatus = likeStatus
            await this.commentRepository.saveLikeInfo(existingLike)

            return {
                status:ResultStatus.Success,
                data: true
            }
        }

        if (likeStatus === LikeStatus.Dislike && existingLike.myStatus === LikeStatus.Like) {

            comment.likesInfo.dislikesCount++
            comment.likesInfo.likesCount--

            await this.commentRepository.saveComment(comment)

            existingLike.myStatus = likeStatus

            await this.commentRepository.saveLikeInfo(existingLike)

            return {
                status: ResultStatus.Success,
                data: true
            }
        }

        await this.commentRepository.saveComment(comment)

        return {
            status: ResultStatus.Success,
            data: true
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

