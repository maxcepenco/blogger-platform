import {Post} from "../Dto/Post";
import {db} from "../../db/db";
import {PostViewModel} from "../Dto/PostViewModel";
import {PostInputModel} from "../Dto/PostInputModel";


export const postRepository = {
    findAllPosts(): Post[] {
        return db.posts.map(p =>({...p}))
    },
    findPostById(id: string):PostViewModel | null{
        return  db.posts.find(c => c.id === id) || null
    },
    createPost(post: PostInputModel): PostViewModel {

        const blog = db.blogs.find(b => b.id === post.blogId)!


        const newPost = {
            id: Date.now().toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName:blog.name
        }
        db.posts.push(newPost)
        return newPost;
    }
}