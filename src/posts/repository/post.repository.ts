import {PostDocument} from "../dto/Post";
import {injectable} from "inversify";
import {PostModel} from "./PostModel";

@injectable()
export class PostRepository {

    async saveCreatedPost(post: PostDocument) {
        const saved = await post.save();
        return saved._id.toString();
    }

    async saveUpdatedPost(post: PostDocument) {
        await post.save()
        return true
    }

    async updatePostByBlogId(blogId: string, name: string): Promise<boolean> {
        await PostModel.updateMany( {blogId: blogId},
                                    {$set: {blogName: name}}
        )
        return true;
    }

    async findById(id: string): Promise<PostDocument | null> {

        const result = await PostModel.findById(id)
        if (!result) {
            return null
        }
        return result
    }


}
