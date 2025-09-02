import {Post} from "../Dto/Post";
import {PostInputModel} from "../Dto/PostInputModel";
import {ObjectId, WithId} from "mongodb";
import {postCollection} from "../../db/mongoDB";


export const postRepository = {
   async findAllPosts(): Promise<WithId<Post>[]> {
        return postCollection.find().toArray();
    },
    async findPostById(id: string): Promise<WithId<Post> | null>{
       return postCollection.findOne({_id: new ObjectId(id)});
    },
    async createPost(newPost: Post): Promise<WithId<Post>> {
       const insertResult = await postCollection.insertOne(newPost);
       return {...newPost, _id:insertResult.insertedId}

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
    }
}