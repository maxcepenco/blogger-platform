import {UserQueryRepository} from "../../users/repository/user.query-repository";
import {CommentRepository} from "../repository/commnet-repository";
import {CommentDocument, LikeStatus} from "../types/comment-db-type";
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


        const result = await this.commentRepository.saveCreatedComment(newComment)
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

        foundComment.content = comment;

        const result = await this.commentRepository.saveUpdatedComment(foundComment)
        if (!result) {
            return {
                status: ResultStatus.NotFound,
                data: null,
            }
        }
        return {
            status: ResultStatus.Success,
            data: result
        }


    }


    async addLikeForComment(commentId: string, likeStatus: LikeStatus, userId: string): Promise<Result<boolean>> {

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

            await this.commentRepository.saveLikeInfo(likeInfo)

            if (likeStatus === LikeStatus.Like) {
                comment.likesInfo.likesCount++

            }

            if (likeStatus === LikeStatus.Dislike) {
                comment.likesInfo.dislikesCount++

            }
            await this.commentRepository.saveUpdatedComment(comment)

            return {
                status: ResultStatus.Success,
                data: true
            }
        }

        if (likeStatus === existingLike.myStatus) {
            return {
                status: ResultStatus.Success,
                data: true
            }
        }

        // const oldStatus = existingLike.myStatus

        // const findStatus = async (statusLike: LikeStatus, oldStatusLike: LikeStatus) => {
        //
        //     if (likeStatus !== existingLike.myStatus) {
        //
        //         existingLike.myStatus = likeStatus
        //
        //         return await this.commentRepository.saveLikeInfo(existingLike)
        //     }
        // }

        // if (likeStatus === LikeStatus.Like && existingLike.myStatus === LikeStatus.Dislike) {
        //
        //     comment.likesInfo.dislikesCount--
        //     comment.likesInfo.likesCount++
        //
        //     await this.commentRepository.saveUpdatedComment(comment)
        //
        //     const resultStatus = findStatus(likeStatus, existingLike.myStatus)
        //
        //     return {
        //         status: ResultStatus.Success,
        //         data: true
        //     }
        // }
        //
        // if (likeStatus === LikeStatus.Dislike && oldStatus === LikeStatus.Like) {
        //
        //     comment.likesInfo.dislikesCount++
        //     comment.likesInfo.likesCount--
        //
        //     await this.commentRepository.saveUpdatedComment(comment)
        //
        //     const resultStatus = findStatus(likeStatus, existingLike.myStatus)
        //
        //     return {
        //         status: ResultStatus.Success,
        //         data: true
        //     }
        // }
        //
        // if (likeStatus === LikeStatus.None && existingLike.myStatus === LikeStatus.Dislike) {
        //
        //     comment.likesInfo.dislikesCount--
        //
        //     await this.commentRepository.saveUpdatedComment(comment)
        //
        //     const resultStatus = findStatus(likeStatus, existingLike.myStatus)
        //
        //
        // }
        //
        // if (likeStatus === LikeStatus.None && existingLike.myStatus === LikeStatus.Like) {
        //
        //     comment.likesInfo.likesCount--
        //
        //     await this.commentRepository.saveUpdatedComment(comment)
        //
        //     const resultStatus = findStatus(likeStatus, existingLike.myStatus)
        //
        // }
        //
        // if (likeStatus === LikeStatus.Like && existingLike.myStatus === LikeStatus.None) {
        //
        //     comment.likesInfo.likesCount++
        //
        //     await this.commentRepository.saveUpdatedComment(comment)
        //
        //     const resultStatus = findStatus(likeStatus, existingLike.myStatus)
        //
        //     return {
        //         status: ResultStatus.Success,
        //         data: true
        //     }
        // }
        //
        // if (likeStatus === LikeStatus.Dislike && oldStatus === LikeStatus.None) {
        //
        //     comment.likesInfo.dislikesCount++
        //
        //     await this.commentRepository.saveUpdatedComment(comment)
        //     const resultStatus = findStatus(likeStatus, existingLike.myStatus)
        //
        //
        //     return {
        //         status: ResultStatus.Success,
        //         data: true
        //     }
        // }

        this.switchLikeStatus(comment, existingLike.myStatus, likeStatus)

        existingLike.myStatus = likeStatus

        await this.commentRepository.saveLikeInfo(existingLike)

        await this.commentRepository.saveUpdatedComment(comment)

        return {
            status: ResultStatus.Success,
            data: true
        }

    }

    private switchLikeStatus(comment: CommentDocument, oldStatus: LikeStatus, newStatus: LikeStatus) {
        switch (newStatus) {

            case LikeStatus.None:
                if (oldStatus === LikeStatus.Like) {
                    comment.likesInfo.likesCount--;
                }
                if (oldStatus === LikeStatus.Dislike) {
                    comment.likesInfo.dislikesCount--;
                }
                break;

            case LikeStatus.Like:
                if (oldStatus === LikeStatus.Dislike) {
                    comment.likesInfo.dislikesCount--;
                    comment.likesInfo.likesCount++;
                }
                if (oldStatus === LikeStatus.None) {
                    comment.likesInfo.likesCount++;
                }
                break;

            case LikeStatus.Dislike:
                if (oldStatus === LikeStatus.Like) {
                    comment.likesInfo.likesCount--;
                    comment.likesInfo.dislikesCount++;
                }
                if (oldStatus === LikeStatus.None) {
                    comment.likesInfo.dislikesCount++;
                }
                break;
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

