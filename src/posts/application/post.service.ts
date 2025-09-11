import {PostInputModel} from "../input/post-input-model";
import {blogRepository} from "../../blogs/repository/blog.repository";
import {Post} from "../domain/Post";
import {postRepository} from "../repository/post.repository";
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




    async updatePost(id:string, dto: PostInputModel): Promise<boolean> {
        return await postRepository.updatePost(id, dto)
    },

    async deletePost(id: string): Promise<boolean> {
        return await postRepository.deletePost(id)
    },


    async createPostForBlog(blogIdData:string, blogName:string, postData: blogPostInput):Promise<string> {


        const newPost:Post = {
            title:postData.title,
            shortDescription:postData.shortDescription,
            content: postData.content,
            blogId: blogIdData,
            blogName: blogName,
            createdAt: new Date().toISOString()
        };
        return await postRepository.createPost(newPost)
    }

}
