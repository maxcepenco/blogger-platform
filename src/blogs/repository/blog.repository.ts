import {Blog, BlogDocument} from "../dto/Blog";
import {BlogInputModel} from "../types/input/blog-input-model";
import {injectable} from "inversify";
import {BlogModel} from "./blog.model";

@injectable()
export class BlogRepository  {


    async findById(id: string): Promise<BlogDocument | null> {

        const result = await BlogModel.findById(id)
        if (!result) {
            return null
        }
        return result
    }

    async createBlog(newBlog: Blog): Promise<string> {
        const createdBlog = await BlogModel.create(newBlog);
        return createdBlog._id.toString()

    }

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        const updatedResult = await BlogModel.updateOne(
            {_id: id},
            {
                $set: {
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl
                }
            }
        )

        return updatedResult.matchedCount === 1
    }

    async deleteBlog(id: string): Promise<boolean> {
        const deleteResult = await BlogModel.deleteOne({_id: id});
        return deleteResult.deletedCount === 1
    }

}

