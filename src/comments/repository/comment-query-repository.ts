import {CommentDocument, LikeDbType} from "../types/comment-db-type";
import {CommentViewModel} from "../types/output/comment.view-model";
import {SortQueryFilterType} from "../../core/types/sortQueryFilter.type";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";
import {injectable} from "inversify";
import {CommentModel, LikeModel} from "./comment-model";

@injectable()
export class CommentQueryRepository {

    async findLikeInfo(userId: string, commentId: string): Promise<LikeDbType | null> {
        const result = await LikeModel.findOne({userId: userId, commentId: commentId});
        if (!result) return null
        return result
    }
    async findLikesInfo(userId: string): Promise<LikeDbType[] | null> {
        const result = await LikeModel.find({userId: userId});
        if (!result) return null
        return result
    }

    async findById(commentId: string, userId?: string): Promise<CommentViewModel | null> {

        const result = await CommentModel.findOne({_id: commentId});
        if (!result) {
            return null;
        }

        const likeInfo = userId ? await this.findLikeInfo(userId, commentId)
                                : null


        return this.mapCommentToViewModel(result, likeInfo?.myStatus);
    }

    async findCommentByPost(queryDto: SortQueryFilterType, postId: string, userId?: string): Promise<PaginateQueryOutput<CommentViewModel>> {

        const {pageNumber, pageSize, sortBy, sortDirection} = queryDto;

        const filter = {postId: postId}

        const skip = (pageNumber - 1) * pageSize;

        const items = await CommentModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)


        const totalCount = await CommentModel.countDocuments(filter)

        const likes = userId ? await this.findLikesInfo(userId) || undefined : undefined;


        const result = this.mapToCommentListPagination(items, pageNumber, pageSize, totalCount,likes );
        return result;
    }


    mapToCommentListPagination(
        items: CommentDocument[],
        pageNumber: number,
        pageSize: number,
        totalCount: number,
        likes?: LikeDbType[],
    ): PaginateQueryOutput<CommentViewModel> {

        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((comment) => {
                let myStatus = "None";

                if (likes) {
                    for (const like of likes) {
                        if (like.commentId === comment._id.toString()) {
                            myStatus = like.myStatus;
                            break;
                        }
                    }
                }

                return this.mapCommentToViewModel(comment, myStatus);
            })
        }
    }


    mapCommentToViewModel(comment: CommentDocument, likeStatus: string = "None"): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt.toISOString(),
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: likeStatus

            }
        }
    }
}


