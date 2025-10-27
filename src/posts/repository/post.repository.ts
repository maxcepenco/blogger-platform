import {PostDocument} from "../dto/Post";
import {PostInputModel} from "../types/input/post-input-model";
import {ObjectId} from "mongodb";
import {postCollection} from "../../db/mongoDB";
import {injectable} from "inversify";
import {PostModel} from "./PostModel";

@injectable()
export class PostRepository {

    async saveCreatedPost (post: PostDocument) {
        const saved = await post.save();
        return saved._id.toString();
    }

    async saveUpdatedPost (post: PostDocument) {
         await post.save()
        return true
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

    async findById(id: string): Promise<PostDocument | null> {

        const result = await PostModel.findById(id)
        if (!result) {
            return null
        }
        return result
    }
}
