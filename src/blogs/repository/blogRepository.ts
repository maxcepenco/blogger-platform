import {Blog} from "../Dto/Blog";
import {ObjectId, WithId} from "mongodb";
import {blogCollection} from "../../db/mongoDB";
import {findBlogBiId} from "../routes/handlers/getlBlogHandler";
import {BlogInputModel} from "../Dto/BlogInputModel";


export const blogRepository = {

    async findAllBlogs(): Promise<WithId<Blog>[]> {
        return blogCollection.find().toArray();
    },

    async findById(id: string): Promise<WithId<Blog> | null> {
        if(!ObjectId.isValid(id)) {
            return  null
        }
        return blogCollection.findOne({_id: new ObjectId(id)})
    },

    async createBlog(newBlog: Blog): Promise<WithId<Blog>> {
        const insertResult = await blogCollection.insertOne(newBlog);
        return { ...newBlog,_id: insertResult.insertedId }
    },

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        const updatedResult = await blogCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set:{
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl
                }
            }

            )

        return updatedResult.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount === 1
    }

    }


