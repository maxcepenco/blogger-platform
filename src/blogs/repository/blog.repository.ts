import {Blog} from "../dto/Blog";
import {ObjectId, WithId} from "mongodb";
import {blogCollection} from "../../db/mongoDB";
import {BlogInputModel} from "../types/input/blog-input-model";
import {injectable} from "inversify";

@injectable()
export class BlogRepository  {


    async findById(id: string): Promise<WithId<Blog>| null> {

        const result = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!result) {
            return null
        }
        return result
    }

    async createBlog(newBlog: Blog): Promise<string> {
        const insertResult = await blogCollection.insertOne(newBlog);
        return insertResult.insertedId.toString();

    }

    async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
        const updatedResult = await blogCollection.updateOne(
            {_id: new ObjectId(id)},
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
        const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount === 1
    }

}

