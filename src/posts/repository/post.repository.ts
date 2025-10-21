import {Post} from "../dto/Post";
import {PostInputModel} from "../types/input/post-input-model";
import {ObjectId} from "mongodb";
import {postCollection} from "../../db/mongoDB";
import {injectable} from "inversify";

@injectable()
export class PostRepository {


    async createPost(newPost: Post): Promise<string> {
       const insertResult = await postCollection.insertOne(newPost);
       return insertResult.insertedId.toString();

    }

    async updatePost( id:string, dto:PostInputModel ): Promise<boolean> {
       const updateResult = await postCollection.updateOne(
           {_id: new ObjectId(id)},
           {$set: dto}
       )
        return updateResult.matchedCount === 1
    }

    async deletePost( id: string): Promise<boolean> {
        const deleteResult = await postCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount === 1
    }

}
