import {PostViewModel} from "../../Dto/PostViewModel";
import {Post} from "../../Dto/Post";
import {WithId} from "mongodb";

export const  mapPostToViewModel = (post: WithId<Post>): PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
    }
}