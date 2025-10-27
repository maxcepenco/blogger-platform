import {CommentDocument} from "../types/comment-db-type";
import {CommentViewModel} from "../types/output/comment.view-model";
import {SortQueryFilterType} from "../../core/types/sortQueryFilter.type";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";
import {injectable} from "inversify";
import {CommentModel} from "./comment-model";

@injectable()
export class CommentQueryRepository {

    async findById(commentId: string, likeStatus?:string): Promise<CommentViewModel | null> {
        const result = await CommentModel.findOne({_id: commentId});
        console.log("result", result);
        if (!result) {
            return null;
        }
        return this.mapCommentToViewModel(result, likeStatus);
    }

    async findCommentByPost(queryDto: SortQueryFilterType, postId: string): Promise<PaginateQueryOutput<CommentViewModel>> {

        const {pageNumber, pageSize, sortBy, sortDirection} = queryDto;

        const filter = {postId: postId}

        const skip = (pageNumber - 1) * pageSize;

        const items = await CommentModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)


        const totalCount = await CommentModel.countDocuments(filter)

        const result = this.mapToCommentListPagination(items, pageNumber, pageSize, totalCount);
        return result;
    }


    mapToCommentListPagination(
        items: CommentDocument[],
        pageNumber: number,
        pageSize: number,
        totalCount: number
    ): PaginateQueryOutput<CommentViewModel> {
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map((comment) => this.mapCommentToViewModel(comment))
        }
    }


    mapCommentToViewModel(comment: CommentDocument,likeStatus:string = "None"): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt.toISOString(),
            likeInfo:{
                likeCount: comment.likesInfo.likesCount,
                dislikeCount: comment.likesInfo.dislikesCount,
                myStatus:likeStatus

            }
        }
    }
}


