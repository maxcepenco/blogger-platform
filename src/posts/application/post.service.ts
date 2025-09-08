import {PostInputModel} from "../input/post-input-model";
import {blogRepository} from "../../blogs/repository/blogRepository";
import {Post} from "../domain/Post";
import {postRepository} from "../repository/postRepository";
import {WithId} from "mongodb";
import {PostQueryInput} from "../input/post-query.input";
import {blogPostInput} from "../../blogs/input/blog-post-input-model";

export const postService = {
    async createPost(dto:PostInputModel): Promise<string> {
        const blogData = await blogRepository.findById(dto.blogId)
        const newPost:Post = {
            title:dto.title,
            shortDescription:dto.shortDescription,
            content: dto.content,
            blogId: blogData._id.toString(),
            blogName:blogData.name,
            createdAt: new Date().toISOString()
        };
        return await postRepository.createPost(newPost);
    },

    async findById(id: string): Promise<WithId<Post>> {
        return await postRepository.findByIdCreatedPost(id)
    },

    async findByIdForGet(id: string): Promise<WithId<Post>| null> {
        return await postRepository.findByIdForGet(id)
    },

    async updatePost(id:string, dto: PostInputModel): Promise<boolean> {
        return await postRepository.updatePost(id, dto)
    },

    async deletePost(id: string): Promise<boolean> {
        return await postRepository.deletePost(id)
    },
    async findMany(inputParams:PostQueryInput):Promise<{ items:WithId<Post>[]; totalCount: number }>{
        return await postRepository.findMany(inputParams)
    },

    async findPostByBlog(queryDto:PostQueryInput, driverId:string ): Promise<{items:WithId<Post>[], totalCount: number}> {
        return postRepository.findPostByBlog(queryDto,  driverId )
    },

    async createPostForBlog(blogIdData:string, postData: blogPostInput):Promise<string> {

        const blog =await  blogRepository.findById(blogIdData);

        const newPost:Post = {
            title:postData.title,
            shortDescription:postData.shortDescription,
            content: postData.content,
            blogId: blogIdData,
            blogName:blog.name,
            createdAt: new Date().toISOString()
        };
        return await postRepository.createPost(newPost)
    }

}
