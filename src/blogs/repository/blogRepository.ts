import {Blog} from "../domain/Blog";
import {ObjectId, WithId} from "mongodb";
import {blogCollection} from "../../db/mongoDB";
import {BlogInputModel} from "../input/blog-input-model";
import {BlogQueryInput} from "../input/blog-query.input";
import {SortDirection} from "../../core/types/sort-direction";


export const blogRepository = {

    async findAllBlogs(): Promise<WithId<Blog>[]> {
        return blogCollection.find().toArray();
    },

    async findById(id: string): Promise<WithId<Blog>> {

        const result = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!result) {
            throw new Error("No blog found.");
        }
        return result
    },

    async findByIdForGet(id: string): Promise<WithId<Blog> | null> {

        return await blogCollection.findOne({_id: new ObjectId(id)})
    },

    async createBlog(newBlog: Blog): Promise<string> {
        const insertResult = await blogCollection.insertOne(newBlog);
        return insertResult.insertedId.toString();

    },

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
    },

    async deleteBlog(id: string): Promise<boolean> {
        const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount === 1
    },



    async findMany(inputParams: BlogQueryInput): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
        const {
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = inputParams;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchNameTerm && searchNameTerm.trim() !== '') {
            filter.name = {$regex: searchNameTerm.trim(), $options: "i"};
        }

        const mongoSortDirection = sortDirection === SortDirection.Asc ? 1 : -1;


        const [items, totalCount] = await Promise.all([
            blogCollection
                .find(filter)
                .sort({[sortBy]: mongoSortDirection})
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            blogCollection.countDocuments(filter)
        ]);

        return {items, totalCount};
    }


}