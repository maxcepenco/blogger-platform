import {BlogInputModel} from "../input/blog-input-model";
import {Blog} from "../domain/Blog";
import {blogRepository} from "../repository/blog.repository";
import {WithId} from "mongodb";
import {BlogQueryInput} from "../input/blog-query.input";

export const blogService = {
    async create(blogDto: BlogInputModel):Promise<string> {
    const newBlog:Blog = {
        name: blogDto.name,
        description: blogDto.description,
        websiteUrl: blogDto.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false
    }
    return await blogRepository.createBlog(newBlog);
},
    async findById(id: string): Promise<WithId<Blog>> {
        return await blogRepository.findById(id)

    },

    async findByIdForGet(id: string): Promise<WithId<Blog>| null> {
        return await blogRepository.findByIdForGet(id)
    },

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        return  await blogRepository.updateBlog(id, blog)
    },


    async deleteBlog(id: string): Promise<boolean> {
        return await  blogRepository.deleteBlog(id)
    },




}
