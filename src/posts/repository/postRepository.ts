import {Post} from "../domain/Post";
import {PostInputModel} from "../input/post-input-model";
import {ObjectId, WithId} from "mongodb";
import {blogCollection, postCollection} from "../../db/mongoDB";
import {RepositoryNotFoundError} from "../../core/errors/response-not-found.error";
import {Blog} from "../../blogs/domain/Blog";
import {PostQueryInput} from "../input/post-query.input";
import {SortDirection} from "../../core/types/sort-direction";


export const postRepository = {
   async findAllPosts(): Promise<WithId<Post>[]> {
        return postCollection.find().toArray();
    },

    async findByIdCreatedPost(id: string): Promise<WithId<Post>>{

       const result = await postCollection.findOne({_id: new ObjectId(id)});
       if(!result) {
           throw new RepositoryNotFoundError()
       }
       return  result;
    },

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

    async findByIdForGet(id: string): Promise<WithId<Post> | null> {

        return await  postCollection.findOne({_id: new ObjectId(id)})
    },

    async findMany(inputParams:PostQueryInput):Promise<{ items: WithId<Post>[]; totalCount: number}> {
       const {
           pageNumber,
           pageSize,
           sortBy,
           sortDirection
       } = inputParams;

       const skip = (pageNumber - 1) * pageSize;
       const filter = {}
        const mongoSortDirection = sortDirection === SortDirection.Asc ? 1 : -1;

        const [items, totalCount] = await Promise.all([
           postCollection
               .find(filter)
               .sort({[sortBy]: mongoSortDirection})
               .skip(skip)
               .limit(pageSize)
               .toArray(),
           postCollection
               .countDocuments(filter)
       ])
        return {items, totalCount}
    },

    async findPostByBlog(queryDto:PostQueryInput, blogId: string): Promise< {items: WithId<Post>[]; totalCount: number}> {

        const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

        const filter = { blogId: blogId };
        const skip = (pageNumber - 1) * pageSize;
        const mongoSortDirection = sortDirection === SortDirection.Asc ? 1 : -1;

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({ [sortBy]: mongoSortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);
        return { items, totalCount };
    },


}