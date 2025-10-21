import {CommentDbType} from "../types/comment-db-type";
import {commentCollection} from "../../db/mongoDB";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class CommentRepository {

    async createCommentForPost(comment: CommentDbType): Promise<string> {
        const insertResult = await commentCollection.insertOne(comment);
        return insertResult.insertedId.toString();
    }

    async findByIdDbType(commentId: string): Promise<CommentDbType | null> {
        const foundCommentDbType = await commentCollection.findOne({_id: new ObjectId(commentId)})
        if (!foundCommentDbType) {
            return null;
        }
        return foundCommentDbType;
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

