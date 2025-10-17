import {commentCollection} from "../../db/mongoDB";
import {ObjectId, WithId} from "mongodb";
import {CommentDbType} from "../types/comment-db-type";
import {CommentViewModel} from "../output/comment.view-model";
import {SortQueryFilterType} from "../../core/types/sortQueryFilter.type";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";


export class CommentQueryRepository {

    async findById(commentId: string): Promise<CommentViewModel | null> {
        const result = await commentCollection.findOne({_id: new ObjectId(commentId)});
        if (!result) {
            return null;
        }
        return this.mapCommentToViewModel(result);
    }

    async findCommentByPost(queryDto: SortQueryFilterType, postId: string): Promise<PaginateQueryOutput<CommentViewModel>> {

        const {pageNumber, pageSize, sortBy, sortDirection} = queryDto;

        const filter = {postId: postId}

        const skip = (pageNumber - 1) * pageSize;

        const items = await commentCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await commentCollection.countDocuments(filter)

        const result = this.mapToCommentListPagination(items, pageNumber, pageSize, totalCount);
        return result;
    }


    mapToCommentListPagination(
        items: WithId<CommentDbType>[],
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
            items: items.map(this.mapCommentToViewModel)
        }
    }


    mapCommentToViewModel(comment: WithId<CommentDbType>): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt

        }
    }
}


