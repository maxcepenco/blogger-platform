import {CommentDocument, LikeDocument} from "../types/comment-db-type";
import {commentCollection} from "../../db/mongoDB";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {CommentModel, LikeModel} from "./comment-model";

@injectable()
export class CommentRepository {

    async findLike(commentId:string, userId:string):Promise< LikeDocument | null> {
        const like = await LikeModel.findOne({
            userId: userId,
            commentId: commentId,
        })
        if(!like) return null
        return like;
    }

    async saveCreatedComment(comment:CommentDocument):Promise<string | null> {
         const  saved = await comment.save()
        if(!saved) return null
        return  saved._id.toString();
    }

    async saveUpdatedComment(comment:CommentDocument):Promise<boolean | null> {
         const  saved = await comment.save()
        if(!saved) return null
        return  true;
    }

    async saveLikeInfo(likeInfo:LikeDocument) {
        await likeInfo.save()
        return true
    }



    async findByIdDbType(commentId: string): Promise<CommentDocument | null> {
        const foundResult = await CommentModel.findOne({_id: commentId})
        if (!foundResult) return null;
        return foundResult;
    }



    async delete(commentId: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({_id: new ObjectId(commentId)})
        return result.deletedCount === 1
    }

}

