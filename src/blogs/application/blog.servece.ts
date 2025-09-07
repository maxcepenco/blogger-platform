import {BlogInputModel} from "../Dto/BlogInputModel";
import {Blog} from "../Dto/Blog";
import {blogRepository} from "../repository/blogRepository";
import {WithId} from "mongodb";
import {blogCollection} from "../../db/mongoDB";

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
        return  blogRepository.updateBlog(id, blog)
    }
}
