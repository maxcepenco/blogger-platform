import {Blog, BlogDocument} from "../dto/Blog";
import {BlogInputModel} from "../types/input/blog-input-model";
import {injectable} from "inversify";
import {BlogModel} from "./blog.model";

@injectable()
export class BlogRepository {


    async findById(id: string): Promise<BlogDocument | null> {

        const result = await BlogModel.findById(id)
        if (!result) {
            return null
        }
        return result
    }

    async createBlog(newBlog: Blog): Promise<string> {
        // const createdBlog = await BlogModel.create(newBlog);
        // return createdBlog._id.toString()

        const blogInstance = new BlogModel(newBlog)
        blogInstance.name = newBlog.name
        blogInstance.description = newBlog.description
        blogInstance.createdAt = newBlog.createdAt
        blogInstance.isMembership = newBlog.isMembership
        await blogInstance.save()

        return blogInstance._id.toString()
    }

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        // const updatedResult = await BlogModel.updateOne(
        //     {_id: id},
        //     {
        //         $set: {
        //             name: blog.name,
        //             description: blog.description,
        //             websiteUrl: blog.websiteUrl
        //         }
        //     }
        // )
        //
        // return updatedResult.matchedCount === 1

        const blogInstance = await this.findById(id)
        if (!blogInstance) return false

        blogInstance.name = blog.name
        blogInstance.description = blog.description
        blogInstance.websiteUrl = blog.websiteUrl
        await blogInstance.save()

        return true
    }

    async deleteBlog(id: string): Promise<boolean> {
        // const deleteResult = await BlogModel.deleteOne({_id: id});
        // return deleteResult.deletedCount === 1

        const blogInstance = await this.findById(id)
        if (!blogInstance) return false
        blogInstance.deleteOne()
        return true
    }

}

