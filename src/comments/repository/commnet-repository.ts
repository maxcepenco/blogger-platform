import {CommentDbType} from "../types/comment-db-type";
import {commentCollection} from "../../db/mongoDB";


export const commentRepository = {

    async createCommentForPost(comment: CommentDbType): Promise<string> {
    const insertResult = await commentCollection.insertOne(comment);
    return insertResult.insertedId.toString();
    }
}