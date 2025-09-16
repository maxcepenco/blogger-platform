import {commentCollection} from "../../db/mongoDB";
import {ObjectId, WithId} from "mongodb";
import {CommentDbType} from "../types/comment-db-type";
import {CommentViewModel} from "../output/comment.view-model";


export const commentQueryRepository = {
    async findById(commentId: string): Promise<CommentViewModel | null> {
        const result = await commentCollection.findOne({_id:new ObjectId(commentId)});
        if(!result) {
            return null;
        }
        return this.mapCommentToViewModel(result);
    },







    mapCommentToViewModel(comment: WithId<CommentDbType>):CommentViewModel {
        return {
            id:comment._id.toString(),
            content:comment.content,
            commentatorInfo:{
                userId:comment.commentatorInfo.userId,
                userLogin:comment.commentatorInfo.userLogin
            },
            createdAt:comment.createdAt

        }
    }
}

