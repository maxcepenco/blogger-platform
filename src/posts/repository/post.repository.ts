import {Post} from "../domain/Post";
import {PostInputModel} from "../input/post-input-model";
import {ObjectId, WithId} from "mongodb";
import {blogCollection, postCollection} from "../../db/mongoDB";
import {RepositoryNotFoundError} from "../../core/errors/response-not-found.error";
import {Blog} from "../../blogs/domain/Blog";
import {PostQueryInput} from "../input/post-query.input";
import {SortDirection} from "../../core/types/sort-direction";


export const postRepository = {


    async createPost(newPost: Post): Promise<string> {
       const insertResult = await postCollection.insertOne(newPost);
       return insertResult.insertedId.toString();

    },

    async updatePost( id:string, dto:PostInputModel ): Promise<boolean> {
       const updateResult = await postCollection.updateOne(
           {_id: new ObjectId(id)},
           {$set: dto}
       )
        return updateResult.matchedCount === 1
    },

    async deletePost( id: string): Promise<boolean> {
        const deleteResult = await postCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount === 1
    },





}