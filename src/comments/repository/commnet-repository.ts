import {CommentDbType, CommentDocument, LikeDocument} from "../types/comment-db-type";
import {commentCollection} from "../../db/mongoDB";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {CommentModel} from "./comment-model";

@injectable()
export class CommentRepository {

    async saveComment(comment:CommentDocument):Promise<string | null> {
         const  saved = await comment.save()
        if(!saved) return null
        return  saved._id.toString();
    }

    async saveLikeInfo(likeInfo:LikeDocument) {
        await likeInfo.save()
    }

    // async createCommentForPost(comment: CommentDbType): Promise<string> {
    //     const insertResult = await commentCollection.insertOne(comment);
    //     return insertResult.insertedId.toString();
    // }

    async findByIdDbType(commentId: string): Promise<CommentDocument | null> {
        const foundResult = await CommentModel.findOne({_id: commentId})
        if (!foundResult) return null;
        return foundResult;
    }

    async update(commentId: string, dto: CommentDbType): Promise<boolean> {
        const result = await commentCollection.updateOne(
            {_id: new ObjectId(commentId)},
            {$set: dto}
        )
        return result.matchedCount === 1
    }

    async delete(commentId: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({_id: new ObjectId(commentId)})
        return result.deletedCount === 1
    }

}

